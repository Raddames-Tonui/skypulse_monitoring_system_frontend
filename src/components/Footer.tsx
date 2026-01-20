import React from "react";
import Icon from "@/utils/Icon";
import { useAuth } from "@/hooks/hooks";


const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer>
      <div className="footer-wrapper">
        <div>
          <Icon iconName="building" />
          <p>{user?.company_name|| "Company Name"}</p>
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
