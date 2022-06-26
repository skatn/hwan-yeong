import { Router } from "express";
import { redirectWithAlert } from "../src/common.mjs";
import bcrypt from "bcrypt";
import { addMember, getMember } from "../src/db.mjs";

const memberRouter = Router();

const defaultUserSession = {
  isLogined: false,
  userId: "",
};
export { defaultUserSession };

memberRouter.get("/login", (req, res) => {
  res.render("login");
});

memberRouter.post("/login", async (req, res) => {
  const id = req.body.mbId || "";
  const pw = req.body.mbPw || "";

  let error = "";
  if (!id || !pw) error = "ERR_EMPTY_VALUE";

  try {
    const member = await getMember(id);
    const same = await bcrypt.compare(pw, member.mb_pw);
    if (!same) error = "ERR_LOGIN_FAIL";

    if (error) {
      redirectWithAlert(res, error, "/member/login");
      return;
    }

    req.session.user = {
      isLogined: true,
      userId: id,
    };
    res.redirect("/");
  } catch (err) {
    console.error("login error");
    console.error(err);
    redirectWithAlert(res, err, "/member/login");
  }
});

memberRouter.get("/signup", (req, res) => {
  res.render("signup");
});

memberRouter.post("/signup", async (req, res) => {
  const id = req.body.mbId || "";
  const pw = req.body.mbPw || "";
  const pwConfirm = req.body.mbPwConfirm || "";

  let error = "";
  if (!id || !pw || !pwConfirm) error = "ERR_EMPTY_VALUE";
  else if (pw !== pwConfirm) error = "ERR_DIFFERENT_PW";
  else if (pw.length < 8) error = "ERR_PASSWORD_SHORT";

  if (error) {
    redirectWithAlert(res, error, "/member/signup");
    return;
  }

  const encryptedPw = await bcrypt.hash(pw, 10);
  try {
    await addMember(id, encryptedPw);
    redirectWithAlert(res, "회원가입 완료", "/");
  } catch (err) {
    console.log("signup error");
    console.log(err);
    redirectWithAlert(res, err, "/member/signup");
  }
});

memberRouter.get("/logout", (req, res) => {
  if (req.session.user.isLogined) {
    req.session.destroy((err) => {
      if (err) {
        console.error("logout error");
        console.error(err);
        redirectWithAlert(res, err, "/");
        return;
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

export { memberRouter };
