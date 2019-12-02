function getSizeContainer(elem) {
  const styles = window.getComputedStyle(elem);
  const { width, height } = styles;
  return { width: parseFloat(width), height: parseFloat(height) };
}

export default {
  getSizeContainer
}