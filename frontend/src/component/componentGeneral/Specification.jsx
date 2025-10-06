import React from "react";

const Specification = ({ product }) => {
  const { specification } = product;

  if (!specification || specification.length === 0) {
    return null;
  }

  return (
    <div className=" p-3  shadow-sm rounded-lg">
      <h2 className={"text-2xl mb-4 secondaryTextColor "}>Specification</h2>

      {specification.map((specGroup, index) => (
        <div key={index} className="mb-6">
          <h3 className="mb-2 text-lg font-bold bg-gray-100 px-3 py-2 secondaryTextColor">
            {specGroup.title}
          </h3>
          <div className="border border-gray-200 rounded">
            <div className="divide-y divide-gray-200">
              {specGroup.specs.map((spec, specIndex) => (
                <div
                  key={specIndex}
                  className={`p-4 ${specIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} md:flex`}
                >
                  <div className="font-bold text-gray-700 md:w-1/3 mb-1 md:mb-0">
                    {spec.label}
                  </div>
                  <div className="text-gray-900">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Specification;
