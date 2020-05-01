const secretToken =
  process.env.ACCESS_TOKEN_SECRET || 'this is a sample seccret';
function signToken(user: IUser) {
  return jwt.sign({ id: user.id }, secretToken);
}
