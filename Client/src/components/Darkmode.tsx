import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import './Darkmode.css';

const Darkmode = () => (
  <form>
    <div style={{ display: 'flex', alignItems: 'center'}}>
      <Switch.Root className="SwitchRoot">
        <Switch.Thumb className="SwitchThumb" />
      </Switch.Root>
    </div>
  </form>
);

export default Darkmode;