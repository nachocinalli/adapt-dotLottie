import React from 'react';

import 'libraries/dotlottie-player';
export default function Dotlottieplayer(props) {
  const { src, settings } = props;
  return (
    <>
      <dotlottie-player
        className='dotlottie-player'
        src={src}
        // {...(settings.autoplay === true && { autoplay: true })}
        {...(settings.loop === true && { loop: true })}
        {...(settings.count !== -1 && { count: settings.count })}
        {...(settings.controls === true && { controls: true })}
      />
    </>
  );
}
