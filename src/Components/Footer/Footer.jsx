import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const commonLinkClass = 'text-base font-medium text-white/60 text-xs hover:text-white/60';

const FooterLink = ({ to, text }) => (
  <li className="mb-4">
    <Link className={commonLinkClass} to={to}>
      {text}
    </Link>
  </li>
);

function Footer() {
  const navigate = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section className="overflow-hidden pt-10 pb-10 bg-[#00040F] text-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-full lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="100px" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  &copy; Copyright 2024. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/3 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                Company
              </h3>
              <ul>
                <FooterLink to="/" text="Features" />
                <FooterLink to="/" text="Pricing" />
                <FooterLink to="/" text="Affiliate Program" />
                <FooterLink to="/" text="Press Kit" />
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/3 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                Support
              </h3>
              <ul>
                <FooterLink to="/" text="Account" />
                <FooterLink to="/" text="Help" />
                <FooterLink to="/" text="Contact Us" />
                <FooterLink to="/" text="Customer Support" />
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/3 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                Legals
              </h3>
              <ul>
                <FooterLink to="/" text="Terms & Conditions" />
                <FooterLink to="/" text="Privacy Policy" />
                <FooterLink to="/" text="Licensing" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
