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
  "Java": <FaJava />,
  "JavaScript": <SiJavascript />,
  "Python": <FaPython />,
  "SQL": <TbSql />,

  // Frontend
  "React.js": <FaReact />,
  "HTML5": <FaHtml5 />,       
  "CSS3": <FaCss3Alt />,   
  "Tailwind CSS": <SiTailwindcss />,
  "Bootstrap": <FaBootstrap />,

  // Backend
  "Spring Boot": <SiSpringboot />,
  "Node.js": <FaNodeJs />,
  "Express.js": <SiExpress />,
  "REST APIs": <TbApi />,

  // Databases
  "MySQL": <SiMysql />,
  "PostgreSQL": <SiPostgresql />,
  "MongoDB": <SiMongodb />,

  // DevOps & Tools
  "Git": <FaGitAlt />,
  "GitHub": <FaGithub />,
  "GitHub Actions": <SiGithubactions />,
  "Docker": <FaDocker />,      
  "Kubernetes (Basics)": <SiKubernetes />,
  "AWS (Basics)": <FaAws />,

  // Others
  "MS Excel": <SiMicrosoftexcel />,
  "Power BI": <SiPowerbi />,
  "NumPy": <SiNumpy />,
  "Pandas": <SiPandas />,
  "Matplotlib": <FaChartLine />, 
  "Seaborn": <FaChartBar />   
};