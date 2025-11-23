import React from "react";
import Icon from "@/utils/Icon";
import { useAuth } from "@/hooks/hooks";


const Footer: React.FC = () => {
  const { user } = useAuth();

  // console.log(user);

  return (
    <footer>
      <div className="footer-wrapper">
        <div>
          <Icon iconName="building" />
          <p>{user?.companyName|| "Company Name"}</p>
        </div>
        <div>
          <Icon iconName="user" />
          <p>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
