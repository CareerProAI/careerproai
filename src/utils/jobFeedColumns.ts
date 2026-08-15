export function jobFeedColumnLayout(bdCount: number, liCount: number) {
  const showBd = bdCount > 0 || liCount === 0;
  const showLi = liCount > 0 || bdCount === 0;
  return { showBd, showLi, twoCol: showBd && showLi };
}
