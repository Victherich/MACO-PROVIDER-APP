import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import styled from 'styled-components';

interface HeaderProps {
  title: string;
}

const StyledHeader = styled(IonHeader)`
  --background: transparent;
`;

const StyledToolbar = styled(IonToolbar)`
  --background: linear-gradient(180deg, #00c8ff 0%, #0073ff 100%);
  color: #ffffff;
  --padding-top: 40px;
  --padding-bottom: 10px;
`;

const StyledTitle = styled(IonTitle)`
  font-weight: bold;
  font-size: 1.5rem;
  color: #ffffff;
`;

const Header: React.FC<HeaderProps> = ({ title }) => (
  <StyledHeader>
    <StyledToolbar>
      <StyledTitle>{title}</StyledTitle>
    </StyledToolbar>
  </StyledHeader>
);

export default Header;
