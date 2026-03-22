import { 
  FaReact, FaNodeJs, FaPython, FaJava, FaGitAlt, FaAws, FaGithub, 
  FaDocker, FaChartLine, FaChartBar, FaHtml5, FaCss3Alt, FaBootstrap 
} from "react-icons/fa";
import { 
  SiMongodb, SiMysql, SiExpress, SiJavascript, SiTailwindcss, 
  SiSpringboot, SiPostgresql, SiGithubactions, SiKubernetes, 
  SiMicrosoftexcel, SiPowerbi, SiNumpy, SiPandas 
} from "react-icons/si";
import { TbSql, TbApi } from "react-icons/tb";

export const iconMap = {
  // Languages
  FaJava: <FaJava />,
  SiJavascript: <SiJavascript />,
  FaPython: <FaPython />,
  TbSql: <TbSql />,

  // Frontend
  FaReact: <FaReact />,
  FaHtml5: <FaHtml5 />,       
  FaCss3Alt: <FaCss3Alt />,   
  FaBootstrap: <FaBootstrap />, 
  SiTailwindcss: <SiTailwindcss />,

  // Backend
  SiSpringboot: <SiSpringboot />,
  FaNodeJs: <FaNodeJs />,
  SiExpress: <SiExpress />,
  TbApi: <TbApi />,

  // Databases
  SiMysql: <SiMysql />,
  SiPostgresql: <SiPostgresql />,
  SiMongodb: <SiMongodb />,

  // DevOps & Tools
  FaGitAlt: <FaGitAlt />,
  FaGithub: <FaGithub />,
  SiGithubactions: <SiGithubactions />,
  FaDocker: <FaDocker />,      
  SiKubernetes: <SiKubernetes />,
  FaAws: <FaAws />,

  // Others
  SiMicrosoftexcel: <SiMicrosoftexcel />,
  SiPowerbi: <SiPowerbi />,
  SiNumpy: <SiNumpy />,
  SiPandas: <SiPandas />,
  FaChartLine: <FaChartLine />, // Using generic line chart for Matplotlib
  FaChartBar: <FaChartBar />,   // Using generic bar chart for Seaborn
};