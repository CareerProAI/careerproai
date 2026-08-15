/** Flatten sqlite-package bind args: run(sql, a, b) or run(sql, [a, b]). */
export function bindParams(params) {
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
}

/** Adapter: node:sqlite DatabaseSync → async exec/get/all/run used by every route. */
export function wrapNodeSqlite(database) {
  const bind = (sql, params) => {
    const stmt = database.prepare(sql);
    return { stmt, args: bindParams(params) };
  };

  return {
    exec: async (sql) => {
      database.exec(sql);
    },
    get: async (sql, ...params) => {
      const { stmt, args } = bind(sql, params);
      try {
        return stmt.get(...args);
      } finally {
        stmt.close?.();
      }
    },
    all: async (sql, ...params) => {
      const { stmt, args } = bind(sql, params);
      try {
        return stmt.all(...args);
      } finally {
        stmt.close?.();
      }
    },
    run: async (sql, ...params) => {
      const { stmt, args } = bind(sql, params);
      try {
        return stmt.run(...args);
      } finally {
        stmt.close?.();
      }
    },
  };
}
