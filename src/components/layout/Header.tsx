import React from "react";

interface HeaderProps {
  headerText: string;
  headerIcon: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ headerText, headerIcon }) => {
  return (
    <div className="d-flex align-items-center gap-2 my-3">
      <h2 className="m-0 fw-bolder">
        {headerIcon} &nbsp; {headerText}
      </h2>
    </div>
  );
};

export default Header;
