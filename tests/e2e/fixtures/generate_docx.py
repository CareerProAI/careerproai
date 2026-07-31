#!/usr/bin/env python3
"""Generates sample-resume.docx as a minimal, genuinely valid OOXML .docx.

No docx-writing library is a project dependency (mammoth only reads .docx), and Node
has no built-in zip writer, so this uses only the Python stdlib's zipfile module —
available in any standard Python 3 install, no pip packages needed. The three parts
below ([Content_Types].xml, _rels/.rels, word/document.xml) are the minimum Word,
LibreOffice, and mammoth.extractRawText all accept as a valid .docx.
"""
import zipfile
from pathlib import Path

HERE = Path(__file__).parent
TXT = (HERE / "sample-resume.txt").read_text(encoding="utf-8")
OUT = HERE / "sample-resume.docx"

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

def paragraph(line: str) -> str:
    escaped = (
        line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    )
    return f'<w:p><w:r><w:t xml:space="preserve">{escaped}</w:t></w:r></w:p>'

body = "\n".join(paragraph(line) for line in TXT.splitlines())

DOCUMENT = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
{body}
</w:body>
</w:document>"""

with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", CONTENT_TYPES)
    z.writestr("_rels/.rels", RELS)
    z.writestr("word/document.xml", DOCUMENT)

print(f"Wrote {OUT}")
