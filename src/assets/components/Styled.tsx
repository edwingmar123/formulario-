import styled from "styled-components";

export const NavBarContainer = styled.nav`
  width: 100%;
  height: 60px;
  padding: 8px;
  margin: 0;
  background-image: linear-gradient(to left, #058af7, #5bc8ac);
  position: relative;
  display: flex;
  color: #ffff;
  justify-content: space-between;
  align-items: center;
`;
export const Logo = styled.div`
  font-size: 24px;
  color: yellow;
  font-weight: bold;
`;



export const DivContainer = styled.div`
  padding: 50px;
  margin: 0 auto;
  max-width: 400px;
  mix-height: 200px;
`;

export const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
export const MenuUl = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 20px;
`;

// export const MenuLi = styled.li`
//   font-size: 18px;
//   color: #fff
//   cursor: pointer;
//   &:hover {
//   color: #f39c12}
// `;

export const PSaludo = styled.p`
  text-align: center;
`;
