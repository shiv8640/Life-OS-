import {motion}from'framer-motion';
export const Button=({children,variant='',...props})=><motion.button whileTap={{scale:.98}} className={'button '+variant} {...props}>{children}</motion.button>;
export const Card=({children,className=''})=><motion.section initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={'card '+className}>{children}</motion.section>;
export const ProgressBar=({value})=><div className="progress"><i style={{width:value+'%'}}/></div>;
