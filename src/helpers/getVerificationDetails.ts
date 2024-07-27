import getformattedDate from "@/lib/getFormattedDate";

const getVerificationDetails = () => {
  const expiryDate = new Date(Date.now() + 3600000);
  const verfiyToken = Math.floor(100000 + Math.random() * 900000).toString();
  const createAt = getformattedDate(new Date());
  return { verfiyToken, expiryDate, createAt };
};

export default getVerificationDetails;
