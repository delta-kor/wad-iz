import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Color } from '../styles/color';

const PrimaryColor = Color.BLUE;
const BackgroundColor = Color.BACKGROUND;
const starOutSize = '80px';
const starInSize = '60px';

const Wrapper = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 1024px) {
    zoom: 0.8;
  }

  @media screen and (max-width: 1024px) {
    zoom: 0.5;
  }
`;

const Text = styled.p`
  position: fixed;
  bottom: 48px;
  left: 0;
  right: 0;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};

  @media screen and (max-width: 1024px) {
    zoom: 0.8;
  }

  @media screen and (max-width: 1024px) {
    zoom: 0.6;
  }
`;

const StarOut = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  background: ${PrimaryColor};
  border-radius: ${starOutSize};
`;

const StarIn = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: rotate(45deg);
  transform-origin: center;
  background: ${BackgroundColor};
  border-radius: 4px;
`;

const StarLine = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: calc(50% - (${starOutSize} * 1.414) / 2 + 10px);
  transform: translateY(-50%);
  height: 10px;
  background: ${PrimaryColor};
  border-radius: 100px;
`;

const Star3DUp = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: calc(50% + 12px);
  transform: translateY(-50%) rotate(-105deg);
  transform-origin: left;
  width: 0;
  height: 10px;
  background: ${PrimaryColor};
  border-radius: 100px;
`;

const Star3DDown = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: calc(50% + 12px);
  transform: translateY(-50%) rotate(105deg);
  transform-origin: left;
  width: 0;
  height: 10px;
  background: ${PrimaryColor};
  border-radius: 100px;
`;

const CircleWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  width: calc(100% - 24px);
  height: calc(100% - 24px);
`;

const CircleInner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background: ${BackgroundColor};
  border-radius: 100%;
`;

const CircleBody = styled(motion.div)`
  position: absolute;
  width: 50%;
  height: 100%;
  transform: rotate(0deg);
  transform-origin: center right;
  border-radius: 1000px 0 0 1000px;
  background: ${PrimaryColor};
`;

const CircleRight = styled(motion.div)`
  position: absolute;
  display: none;
  top: 0;
  bottom: 0;
  right: 0;
  width: 50%;
  border-radius: 0 1000px 1000px 0;
  background: ${PrimaryColor};
`;

const CircleLeft = styled(motion.div)`
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  width: 50%;
  background: ${BackgroundColor};
  border: 1px solid ${BackgroundColor};
`;

const LightA = styled(motion.div)`
  position: absolute;
  display: none;
  top: 93px;
  left: 47.5px;
  transform: translateX(-50%);
  border-radius: 20px;
  width: 10px;
  height: 10px;
  background: ${PrimaryColor};
`;

const LightB = styled(motion.div)`
  position: absolute;
  display: none;
  top: 93px;
  left: 47.5px;
  transform: translateX(-50%) rotate(45deg);
  border-radius: 20px;
  width: 10px;
  height: 10px;
  background: ${PrimaryColor};
`;

const LightC = styled(motion.div)`
  position: absolute;
  display: none;
  top: 93px;
  left: 47.5px;
  transform: translateX(-50%) rotate(90deg);
  border-radius: 20px;
  width: 10px;
  height: 10px;
  background: ${PrimaryColor};
`;

const RounderA = styled(motion.div)`
  position: absolute;
  top: 42.5px;
  left: 107.5px;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  background: ${PrimaryColor};
  border-radius: 100px;
`;

const RounderB = styled(motion.div)`
  position: absolute;
  top: 59.5px;
  left: 83px;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  background: ${PrimaryColor};
  border-radius: 100px;
`;

export default function Loading() {
  const starOutControls = useAnimation();
  const starInControls = useAnimation();
  const starLineControls = useAnimation();
  const star3DUpControls = useAnimation();
  const star3DDownControls = useAnimation();
  const circleBodyControls = useAnimation();
  const circleLeftControls = useAnimation();
  const circleRightControls = useAnimation();
  const lightAControls = useAnimation();
  const lightBControls = useAnimation();
  const lightCControls = useAnimation();
  const rounderAControls = useAnimation();
  const rounderBControls = useAnimation();

  async function animate() {
    await starOutControls.start({
      top: `calc(50% - ${starOutSize} / 2)`,
      left: `calc(50% - ${starOutSize} / 2)`,
      width: starOutSize,
      height: starOutSize,
      transition: { type: 'just' },
    });

    await starOutControls.start({
      borderRadius: '6px',
      transition: { type: 'just' },
    });

    await starOutControls.start({
      transform: 'rotate(45deg)',
      transition: { type: 'just' },
    });

    await starInControls.start({
      top: `calc(50% - ${starInSize} / 2)`,
      left: `calc(50% - ${starInSize} / 2)`,
      width: starInSize,
      height: starInSize,
      opacity: 1,
      transition: { type: 'just' },
    });

    await starLineControls.start({
      width: `calc(${starOutSize} * 1.414 - 20px)`,
      transition: { type: 'just' },
    });

    star3DUpControls.start({
      width: 53.13,
      transition: { type: 'just' },
    });

    star3DDownControls.start({
      width: 53.13,
      transition: { type: 'just' },
    });

    await delay(100);

    rounderAControls.start({
      width: 10,
      height: 10,
      display: 'block',
      transition: { type: 'just' },
    });

    await delay(200);

    await circleBodyControls.start({
      transform: 'rotate(180deg)',
      transition: { duration: 0.8, ease: 'easeIn' },
    });

    circleLeftControls.start({ display: 'none' });
    circleRightControls.start({ display: 'block' });

    await circleBodyControls.start({
      transform: 'rotate(350deg)',
      transition: { duration: 0.8, ease: 'easeOut' },
    });

    rounderBControls.start({
      width: 10,
      height: 10,
      transition: { type: 'just' },
    });

    lightAControls.start({
      width: 100,
      display: 'block',
      transition: { type: 'just' },
    });

    await delay(50);

    lightBControls.start({
      width: 100,
      display: 'block',
      transition: { type: 'just' },
    });

    await delay(50);

    lightCControls.start({
      width: 100,
      display: 'block',
      transition: { type: 'just' },
    });

    // --------------------------- //
    await delay(2000);

    lightCControls
      .start({
        width: 0,
        transition: { type: 'just' },
      })
      .then(() => lightCControls.start({ display: 'none' }));

    await delay(50);

    lightBControls
      .start({
        width: 0,
        transition: { type: 'just' },
      })
      .then(() => lightBControls.start({ display: 'none' }));

    await delay(50);

    lightAControls
      .start({
        width: 0,
        transition: { type: 'just' },
      })
      .then(() => lightAControls.start({ display: 'none' }));

    await rounderBControls.start({
      width: 0,
      height: 0,
      transition: { type: 'just' },
    });

    await circleBodyControls.start({
      transform: 'rotate(180deg)',
      transition: { duration: 0.8, ease: 'easeIn' },
    });

    circleLeftControls.start({ display: 'block' });
    circleRightControls.start({ display: 'none' });

    await circleBodyControls.start({
      transform: 'rotate(0deg)',
      transition: { duration: 0.8, ease: 'easeOut' },
    });

    rounderAControls
      .start({
        width: 0,
        height: 0,
        transition: { type: 'just' },
      })
      .then(() => rounderAControls.start({ display: 'none' }));

    star3DUpControls.start({
      width: 0,
      transition: { type: 'just' },
    });

    star3DDownControls.start({
      width: 0,
      transition: { type: 'just' },
    });

    await delay(200);

    starLineControls.start({
      width: 0,
      transition: { type: 'just' },
    });

    await delay(100);

    await starInControls.start({
      opacity: 0,
      transition: { type: 'just' },
    });

    starOutControls
      .start({
        transform: 'rotate(-45deg)',
        transition: { type: 'just' },
      })
      .then(() =>
        starOutControls.start({
          transform: 'rotate(45deg)',
          transition: { duration: 0 },
        })
      );

    animate();
  }

  useEffect(() => void animate(), []);

  return (
    <>
      <Text>서버에 연결하는 중</Text>
      <Wrapper>
        <CircleWrapper>
          <CircleRight animate={circleRightControls} />
          <CircleBody animate={circleBodyControls} />
          <CircleLeft animate={circleLeftControls} />
          <CircleInner />
        </CircleWrapper>

        <LightA animate={lightAControls} />
        <LightB animate={lightBControls} />
        <LightC animate={lightCControls} />

        <StarOut animate={starOutControls} />
        <StarIn animate={starInControls} />
        <StarLine animate={starLineControls} />

        <Star3DUp animate={star3DUpControls} />
        <Star3DDown animate={star3DDownControls} />

        <RounderA animate={rounderAControls} />
        <RounderB animate={rounderBControls} />
      </Wrapper>
    </>
  );
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
