import { 
  FaReact, FaNodeJs, FaPython, FaJava, FaGitAlt, FaAws, FaGithub, 
  FaDocker, FaHtml5, FaCss3Alt, FaBootstrap 
} from "react-icons/fa";
import { 
  SiMongodb, SiMysql, SiExpress, SiJavascript, SiTailwindcss, 
  SiSpringboot, SiPostgresql, SiGithubactions, SiKubernetes
} from "react-icons/si";
import { TbSql, TbApi } from "react-icons/tb";

export const iconMap = {
  "Java": <FaJava />,
  "JavaScript": <SiJavascript />,
  "Python": <FaPython />,
  "SQL": <TbSql />,

  "React.js": <FaReact />,
  "HTML5": <FaHtml5 />,       
  "CSS3": <FaCss3Alt />,   
  "Tailwind CSS": <SiTailwindcss />,
  "Bootstrap": <FaBootstrap />,

  "Spring Boot": <SiSpringboot />,
  "Node.js": <FaNodeJs />,
  "Express.js": <SiExpress />,
  "REST APIs": <TbApi />,

  "MySQL": <SiMysql />,
  "PostgreSQL": <SiPostgresql />,
  "MongoDB": <SiMongodb />,

  "Git": <FaGitAlt />,
  "GitHub": <FaGithub />,
  "GitHub Actions": <SiGithubactions />,
  "Docker": <FaDocker />,      
  "Kubernetes (Basics)": <SiKubernetes />,
  "AWS (Basics)": <FaAws />,
};