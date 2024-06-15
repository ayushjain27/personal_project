import Associate from "../models/associate";

const createAssociate = async (req, res) => {
  let { email } = req.body;
  let user = await Associate.findOne({ email });
  if (!user) {
    const newAssociate = await Associate.create(req.body);
    return newAssociate;
  } else {
    return res
      .status(400)
      .json({ success, error: "Sorry a user with this email already exists" });
  }
};

const fetchAllAssociate = async (req, res) => {
  const allAssociates = await Associate.find();
  res.json(allAssociates);
};

const fetchAssociateByParentId = async (req, res) => {
  const { parentId } = req.body;
  if (parentId) {
    const associates = await Associate.find({ parentId });
    res.json(associates);
  } else {
    return res
      .status(400)
      .json({ success, error: "Sorry this associate is not exists" });
  }
};

export default { createAssociate, fetchAllAssociate, fetchAssociateByParentId };
