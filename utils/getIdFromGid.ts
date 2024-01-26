const getIdFromGid = (gid: string) => {
  return gid.split("/").reverse().at(0);
};

export default getIdFromGid;
