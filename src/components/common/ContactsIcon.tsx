import GithubIcon from "@/src/components/icons/GithubIcon";
import InstagramIcon from "@/src/components/icons/InstagramIcon";
import LinkedinIcon from "@/src/components/icons/LinkedinIcon";
import MailIcon from "@/src/components/icons/MailIcon";
import TagIcon from "@/src/components/icons/TagIcon";
import TwitterIcon from "@/src/components/icons/TwitterIcon";
import VelogIcon from "@/src/components/icons/VelogIcon";
import YoutubeIcon from "@/src/components/icons/YoutubeIcon";

const icons = {
  email: MailIcon,
  github: GithubIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  velog: VelogIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
};

export default function ContactsIcon({
  contact,
  ...props
}: React.ComponentProps<"svg"> & { contact: string }) {
  const Component = icons[contact] ?? TagIcon;

  return <Component {...props} />;
}
