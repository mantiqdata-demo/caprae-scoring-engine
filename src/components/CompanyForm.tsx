"use client";

import { CompanyInput, BusinessModel, OwnerType } from "@/types";

interface Props {
  value: CompanyInput;
  onChange: (v: CompanyInput) => void;
  onSubmit: () => void;
  loading: boolean;
}

const inputClass =
  "w-full bg-surface-2 border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors placeholder-zinc-600";

const labelClass = "block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5";

export default function CompanyForm({ value, onChange, onSubmit, loading }: Props) {
  const set = (field: keyof CompanyInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => onChange({ ...value, [field]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company Name *</label>
          <input
            className={inputClass}
            placeholder="Acme HVAC Services"
            value={value.companyName}
            onChange={set("companyName")}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Industry *</label>
          <select
            className={inputClass}
            value={value.industry}
            onChange={set("industry")}
            required
          >
            <option value="">Select an industry…</option>
            <optgroup label="Field Services">
              <option value="HVAC">HVAC</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Landscaping / Lawn Care">Landscaping / Lawn Care</option>
              <option value="Pest Control">Pest Control</option>
              <option value="Roofing">Roofing</option>
              <option value="Cleaning Services">Cleaning Services</option>
            </optgroup>
            <optgroup label="Healthcare Services">
              <option value="Home Health / Hospice">Home Health / Hospice</option>
              <option value="Dental Practice">Dental Practice</option>
              <option value="Physical Therapy">Physical Therapy</option>
              <option value="Behavioral Health">Behavioral Health</option>
              <option value="Veterinary Services">Veterinary Services</option>
            </optgroup>
            <optgroup label="Business Services">
              <option value="Accounting / CPA Firm">Accounting / CPA Firm</option>
              <option value="IT Managed Services (MSP)">IT Managed Services (MSP)</option>
              <option value="Staffing / Recruiting">Staffing / Recruiting</option>
              <option value="Insurance Agency">Insurance Agency</option>
              <option value="Marketing / Agency">Marketing / Agency</option>
            </optgroup>
            <optgroup label="Logistics & Distribution">
              <option value="Trucking / Freight">Trucking / Freight</option>
              <option value="Last-Mile Delivery">Last-Mile Delivery</option>
              <option value="Warehousing / 3PL">Warehousing / 3PL</option>
            </optgroup>
            <optgroup label="SaaS / Technology">
              <option value="Vertical SaaS">Vertical SaaS</option>
              <option value="Niche B2B SaaS">Niche B2B SaaS</option>
              <option value="E-commerce / Retail Tech">E-commerce / Retail Tech</option>
            </optgroup>
            <optgroup label="Manufacturing & Industrial">
              <option value="Specialty Manufacturing">Specialty Manufacturing</option>
              <option value="Industrial Services">Industrial Services</option>
              <option value="Environmental Services">Environmental Services</option>
            </optgroup>
            <optgroup label="Education & Training">
              <option value="Vocational / Trade Training">Vocational / Trade Training</option>
              <option value="Childcare / Early Education">Childcare / Early Education</option>
              <option value="Tutoring / Test Prep">Tutoring / Test Prep</option>
            </optgroup>
            <optgroup label="Travel & Hospitality">
              <option value="Travel Agency">Travel Agency</option>
              <option value="Tour Operator">Tour Operator</option>
              <option value="Hotels / Boutique Lodging">Hotels / Boutique Lodging</option>
              <option value="Event Planning">Event Planning</option>
              <option value="Corporate Travel Management">Corporate Travel Management</option>
            </optgroup>
            <optgroup label="Food & Beverage">
              <option value="Restaurant / QSR">Restaurant / QSR</option>
              <option value="Food Distribution">Food Distribution</option>
              <option value="Specialty Food Manufacturing">Specialty Food Manufacturing</option>
              <option value="Catering Services">Catering Services</option>
            </optgroup>
            <optgroup label="Real Estate & Construction">
              <option value="Residential Construction">Residential Construction</option>
              <option value="Commercial Construction">Commercial Construction</option>
              <option value="Property Management">Property Management</option>
              <option value="Real Estate Services">Real Estate Services</option>
            </optgroup>
            <optgroup label="Automotive">
              <option value="Auto Repair / Service">Auto Repair / Service</option>
              <option value="Auto Dealership">Auto Dealership</option>
              <option value="Fleet Services">Fleet Services</option>
            </optgroup>
            <optgroup label="Financial Services">
              <option value="Wealth Management / RIA">Wealth Management / RIA</option>
              <option value="Bookkeeping / Payroll">Bookkeeping / Payroll</option>
              <option value="Mortgage / Lending">Mortgage / Lending</option>
            </optgroup>
            <optgroup label="Media & Communications">
              <option value="Digital Marketing / SEO">Digital Marketing / SEO</option>
              <option value="PR / Communications">PR / Communications</option>
              <option value="Printing / Signage">Printing / Signage</option>
            </optgroup>
            <optgroup label="Fitness & Wellness">
              <option value="Gym / Fitness Studio">Gym / Fitness Studio</option>
              <option value="Spa / Salon">Spa / Salon</option>
              <option value="Mental Health / Therapy Practice">Mental Health / Therapy Practice</option>
            </optgroup>
            <optgroup label="Security">
              <option value="Physical Security / Guard Services">Physical Security / Guard Services</option>
              <option value="Cybersecurity Services">Cybersecurity Services</option>
              <option value="Alarm & Monitoring">Alarm & Monitoring</option>
              <option value="Investigations / Background Screening">Investigations / Background Screening</option>
            </optgroup>
            <optgroup label="Aerospace & Defense">
              <option value="Aerospace Manufacturing">Aerospace Manufacturing</option>
              <option value="MRO / Aviation Services">MRO / Aviation Services</option>
              <option value="Defense Systems & Components">Defense Systems & Components</option>
              <option value="UAV / Drone Services">UAV / Drone Services</option>
            </optgroup>
            <optgroup label="Government Contracting">
              <option value="Federal IT Contracting">Federal IT Contracting</option>
              <option value="Defense Contracting">Defense Contracting</option>
              <option value="Facilities / Base Operations">Facilities / Base Operations</option>
              <option value="Professional Services — Gov't">Professional Services — Gov't</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Estimated Revenue</label>
          <select
            className={inputClass}
            value={value.estimatedRevenue}
            onChange={set("estimatedRevenue")}
          >
            <option value="">Select range…</option>
            <option value="Under $500K">Under $500K</option>
            <option value="$500K – $1M">$500K – $1M</option>
            <option value="$1M – $2.5M">$1M – $2.5M</option>
            <option value="$2.5M – $5M">$2.5M – $5M</option>
            <option value="$5M – $10M">$5M – $10M</option>
            <option value="$10M – $20M">$10M – $20M</option>
            <option value="$20M – $50M">$20M – $50M</option>
            <option value="Over $50M">Over $50M</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Employee Count</label>
          <input
            className={inputClass}
            placeholder="32"
            type="number"
            min="1"
            value={value.employeeCount}
            onChange={set("employeeCount")}
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <select
            className={inputClass}
            value={value.location}
            onChange={set("location")}
          >
            <option value="">Select state…</option>
            <optgroup label="Southeast">
              <option value="Alabama">Alabama</option>
              <option value="Florida">Florida</option>
              <option value="Georgia">Georgia</option>
              <option value="North Carolina">North Carolina</option>
              <option value="South Carolina">South Carolina</option>
              <option value="Tennessee">Tennessee</option>
              <option value="Virginia">Virginia</option>
            </optgroup>
            <optgroup label="Southwest">
              <option value="Arizona">Arizona</option>
              <option value="Colorado">Colorado</option>
              <option value="Nevada">Nevada</option>
              <option value="New Mexico">New Mexico</option>
              <option value="Texas">Texas</option>
              <option value="Utah">Utah</option>
            </optgroup>
            <optgroup label="Midwest">
              <option value="Illinois">Illinois</option>
              <option value="Indiana">Indiana</option>
              <option value="Iowa">Iowa</option>
              <option value="Kansas">Kansas</option>
              <option value="Michigan">Michigan</option>
              <option value="Minnesota">Minnesota</option>
              <option value="Missouri">Missouri</option>
              <option value="Ohio">Ohio</option>
              <option value="Wisconsin">Wisconsin</option>
            </optgroup>
            <optgroup label="Northeast">
              <option value="Connecticut">Connecticut</option>
              <option value="Massachusetts">Massachusetts</option>
              <option value="New Jersey">New Jersey</option>
              <option value="New York">New York</option>
              <option value="Pennsylvania">Pennsylvania</option>
            </optgroup>
            <optgroup label="West">
              <option value="California">California</option>
              <option value="Oregon">Oregon</option>
              <option value="Washington">Washington</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Business Model</label>
          <select
            className={inputClass}
            value={value.businessModel}
            onChange={set("businessModel")}
          >
            <option value="saas">SaaS</option>
            <option value="services-recurring">Services — Recurring</option>
            <option value="services-project">Services — Project</option>
            <option value="product">Product</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Years in Business</label>
          <input
            className={inputClass}
            placeholder="14"
            type="number"
            min="0"
            value={value.yearsInBusiness}
            onChange={set("yearsInBusiness")}
          />
        </div>
        <div>
          <label className={labelClass}>Owner Type</label>
          <select
            className={inputClass}
            value={value.ownerType}
            onChange={set("ownerType")}
          >
            <option value="founder">Founder-Owned</option>
            <option value="family">Family-Owned</option>
            <option value="pe-backed">PE-Backed</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-2.5 bg-gold text-black text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Scoring…" : "Score Company"}
      </button>
    </form>
  );
}
