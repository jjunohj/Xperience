import Profile from "./_components/Profile";
import InfoSection from "./_components/InfoSection";
import TechStack from "./_components/TechStack";
import {
  techStacks,
  projects,
  activities,
  awards,
  educations,
  certifications,
} from "./_components/data";
import Project from "./_components/Project";
import Activity from "./_components/Activity";
import PrintButton from "./_components/PrintButton";

export default function AboutPage() {
  return (
    <div className="flex h-full w-full justify-center">
      <div id="resume">
        <Profile />
        <InfoSection title={"기술"}>
          {techStacks.map((stack, index) => (
            <TechStack
              key={index}
              title={stack.title}
              elements={stack.elements}
            />
          ))}
        </InfoSection>
        <InfoSection title={"프로젝트"}>
          {projects.map((project, index) => (
            <Project key={index} {...project} />
          ))}
        </InfoSection>
        <InfoSection title={"활동·교육"}>
          {activities.map((activity, index) => (
            <Activity key={index} {...activity} />
          ))}
        </InfoSection>
        <InfoSection title={"수상"}>
          {awards.map((award, index) => (
            <Activity key={index} {...award} />
          ))}
        </InfoSection>
        <InfoSection title={"자격·어학"}>
          {certifications.map((certification, index) => (
            <Activity key={index} {...certification} />
          ))}
        </InfoSection>
        <InfoSection title={"학력"}>
          {educations.map((education, index) => (
            <Activity key={index} {...education} />
          ))}
        </InfoSection>
      </div>
      <PrintButton />
    </div>
  );
}
