import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;

  @media (max-width: 600px) {
    width: 100%;
  }
`;
