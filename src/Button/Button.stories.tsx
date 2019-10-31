import React from 'react';
import styled from 'styled-components';

import { Button } from './index';

export default { title: 'Button' };

const ButtonWrapper = styled.div`
  padding: 20px;

  ${Button} {
    margin-right: 10px;
  }
`;

const ButtonDisabledWrapper = styled.div`
  padding: 20px;

  ${Button} {
    margin-right: 10px;
  }
`;

const ButtonBlockWrapper = styled.div`
  padding: 20px;

  ${Button} {
    margin-bottom: 10px;
  }
`;

export const UseButton = () => {
  return (
    <div>
      <ButtonWrapper>
        <Button>Default</Button>
        <Button primary>Primary</Button>
        <Button danger>Danger</Button>
      </ButtonWrapper>
      <ButtonDisabledWrapper>
        <Button disabled>Default</Button>
        <Button disabled primary>
          Primary
        </Button>
        <Button disabled danger>
          Danger
        </Button>
      </ButtonDisabledWrapper>
      <ButtonBlockWrapper>
        <Button block>Default</Button>
        <Button block primary>
          Primary
        </Button>
        <Button block danger>
          Danger
        </Button>
      </ButtonBlockWrapper>
    </div>
  );
};
