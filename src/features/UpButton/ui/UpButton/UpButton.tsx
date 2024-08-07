import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { classNames } from '@/shared/lib/classNames/classNames';
import UpIcon from '@/shared/assets/icons/up.svg';
import { useScrollY } from '@/shared/lib/hooks/useScrollY/useScrollY';
import { Icon } from '@/shared/ui/Icon';
import cls from './UpButton.module.scss';

interface UpButtonProps {
  className?: string;
}

export const UpButton = (props: UpButtonProps) => {
  const { className } = props;
  const controls = useAnimation();

  const y = useScrollY();

  useEffect(() => {
    controls.start({ opacity: y / document.body.scrollHeight });
  }, [y, controls]);

  const upToTopHandler = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div animate={controls} initial={{ opacity: 0 }}>
      <Icon
        label="Наверх"
        Svg={UpIcon}
        className={classNames(cls.up, {}, [className])}
        clickable
        onClick={upToTopHandler}
      />
    </motion.div>
  );
};
