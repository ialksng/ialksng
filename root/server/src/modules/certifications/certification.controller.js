import Certification from "./certification.model.js";

export const getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const addCertification = async (req, res) => {
  try {
    const { title, issuer, date, credentialUrl, imageUrl } = req.body;
    const cert = new Certification({ title, issuer, date, credentialUrl, imageUrl });
    const createdCert = await cert.save();
    res.status(201).json(createdCert);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (cert) {
      await cert.deleteOne();
      res.json({ message: "Certification removed" });
    } else {
      res.status(404).json({ message: "Certification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};