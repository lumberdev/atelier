export const areArraysTheSame = (arr1, arr2) => {
  if (arr1.length != arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].id != arr2[i].id) return false;
  }
  return true;
};
