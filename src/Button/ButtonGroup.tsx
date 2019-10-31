import styled from 'styled-components';

import { Button } from './Button';

export const ButtonGroup = styled.div`
  ${Button} {
    margin-left: 8px;

    &:first-child {
      margin-left: 0;
    }
  }
`;
