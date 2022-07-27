import { userModel } from '../db/models/user-model.js';

/*
    GET /api/auth/loginWithKakao?code=${code}
*/
export const loginWithKakao = async (req, res) => {
  const { code } = req.query; //쿼리로 인가코드를 받아옴
  console.log(code);

  try {
    const {
      data: { access_token: kakaoAccessToken },
    } = await axios('https://kauth.kakao.com/oauth/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI + '?platform=kakao',
        code: code,
      },
    }); //액세스 토큰을 받아온다

    const { data: kakaoUser } = await axios(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      }
    ); //유저 정보를 받아온다
    console.log('data:', data);

    let existingMember = null;
    existingMember = await userModel.findByEmail();

    if (existingMember === null) {
      const newMember = await member.create({
        user_id: kakaoUser.id,
        nickname: kakaoUser.properties.nickname,
        profile_image: kakaoUser.properties.profile_image,
        email: kakaoUser.kakao_account.email || null,
        platform: 'kakao',
      });

      const accessToken = await generateToken(newMember);
      res.json({
        success: true,
        accessToken,
      });
    } else {
      const accessToken = await generateToken(existingMember);
      res.json({
        success: true,
        accessToken,
      });
    }
  } catch (err) {
    res.status(403).json({
      message: err.message,
    });
  }
};
