"use client";
import {Navigation} from "@/components/Navigation";

export default function EducationalContentPage() {
  return (
    <div className="bg-[#80cbc4] min-h-screen">
      <Navigation/>
      <div className="container mx-auto p-4">
        {/* Masonry layout container */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {/* Wrap each section in a break-inside-avoid box */}
          <section className="break-inside-avoid">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-center">
                🌱 1. Introduction to Smart Irrigation
              </h2>
              <p className="mb-4">
                Smart irrigation is all about using technology to water plants more
                efficiently and sustainably. By monitoring water quality through
                sensors, we can make sure the water we use is actually good for the
                plants—helping them grow better, stay healthy, and avoid damage from
                poor-quality water.
              </p>
              <p className="mb-4">
                Using sensors like temperature, TDS, pH, and turbidity meters, our
                system gathers real-time data about the water being used. This
                information is then analyzed to determine whether the water is
                suitable for irrigation or if adjustments are needed.
              </p>
            </div>
          </section>

          {/* Repeat this pattern for all other sections */}
          <section className="break-inside-avoid">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-center">
                💧 2. Understanding Water Quality Parameters
              </h2>
              <p className="mb-4">
                Knowing what your sensor readings mean is key to making good
                irrigation decisions. Here’s a breakdown of each parameter we
                monitor:
              </p>

              <h3 className="font-semibold mt-4 text-lg">🌡️ Temperature</h3>
              <p>
                <span className="font-bold">What it is</span>: Measures how hot or
                cold the water is.
              </p>
              <p>
                <span className="font-bold">Why it matters</span>: Water that’s too
                hot or too cold can stress plant roots and affect nutrient
                absorption.
              </p>
              <p>
                <span className="font-bold">Ideal range</span>: Usually between 10°C
                – 25°C, depending on the plant species.
              </p>

              <h3 className="font-semibold mt-4 text-lg">
                ⚡ TDS (Total Dissolved Solids)
              </h3>
              <p>
                <span className="font-bold">What it is</span>: TDS measures the
                concentration of dissolved substances in water, such as minerals,
                salts, and organic matter.
              </p>
              <p>
                <span className="font-bold">Why it matters</span>: Too many dissolved
                solids can harm plants by interfering with water and nutrient
                uptake.
              </p>
              <p>
                <span className="font-bold">Ideal range</span>: For most plants,
                300–1000 ppm is acceptable. Sensitive plants may need even lower
                levels.
              </p>

              <h3 className="font-semibold mt-4 text-lg">🧪 pH</h3>
              <p>
                <span className="font-bold">What it is</span>: Indicates how acidic
                or alkaline the water is, on a scale of 0 to 14.
              </p>
              <p>
                <span className="font-bold">Why it matters</span>: The pH level
                affects how easily plants can absorb nutrients from soil and water.
              </p>
              <p>
                <span className="font-bold">Ideal range</span>: Typically 6.5 – 8.5
                for most plants.
              </p>

              <h3 className="font-semibold mt-4 text-lg">🌫️ Turbidity</h3>
              <p>
                <span className="font-bold">What it is</span>: Measures how clear or
                cloudy the water is—caused by particles like silt, algae, or other
                organic materials.
              </p>
              <p>
                <span className="font-bold">Why it matters</span>: High turbidity can
                clog irrigation systems and signal the presence of harmful
                substances.
              </p>
              <p>
                <span className="font-bold">Ideal level</span>: The lower, the better.
                Turbidity should generally be below 5 NTU for irrigation.
              </p>
            </div>
          </section>

          {/* 3. Ideal Ranges for Different Plants */}
          <section className="break-inside-avoid">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-center">
                🌿 3. Ideal Ranges for Different Plants
              </h2>
              <p className="mb-4">
                Different plants have different needs! Here’s a quick guide to
                common plant types and the ideal water quality ranges for them:
              </p>
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-secondary text-secondary-foreground">
                      <th className="px-4 py-2">Plant Type</th>
                      <th className="px-4 py-2">TDS (ppm)</th>
                      <th className="px-4 py-2">pH</th>
                      <th className="px-4 py-2">Temperature (°C)</th>
                      <th className="px-4 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">Leafy Greens</td>
                      <td className="border px-4 py-2">400–800</td>
                      <td className="border px-4 py-2">6.0–6.5</td>
                      <td className="border px-4 py-2">15–25</td>
                      <td className="border px-4 py-2">Sensitive to high salts</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Tomatoes</td>
                      <td className="border px-4 py-2">800–1200</td>
                      <td className="border px-4 py-2">5.8–6.8</td>
                      <td className="border px-4 py-2">18–26</td>
                      <td className="border px-4 py-2">
                        Moderate TDS tolerance
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Flowers</td>
                      <td className="border px-4 py-2">300–700</td>
                      <td className="border px-4 py-2">6.0–7.0</td>
                      <td className="border px-4 py-2">15–30</td>
                      <td className="border px-4 py-2">Watch for pH drift</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Herbs</td>
                      <td className="border px-4 py-2">500–1000</td>
                      <td className="border px-4 py-2">5.5–6.5</td>
                      <td className="border px-4 py-2">15–25</td>
                      <td className="border px-4 py-2">Need consistent quality</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Root Vegetables</td>
                      <td className="border px-4 py-2">500–1000</td>
                      <td className="border px-4 py-2">6.0–6.8</td>
                      <td className="border px-4 py-2">15–22</td>
                      <td className="border px-4 py-2">
                        Sensitive to high turbidity
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2">
                <span className="font-bold" style={{color: "#4a5568"}}>
                  Tip:
                </span>{" "}
                <span style={{color: "#a0aec0"}}>
                  Always check your specific plant’s requirements when possible.
                </span>
              </p>
            </div>
          </section>

          {/* 4. How to Improve Water Quality for Plants */}
          <section className="break-inside-avoid">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-center">
                🛠️ 4. Water Quality Improvement Guidelines
              </h2>

              <h3 className="font-semibold mt-4">🌫️ Turbidity Reduction </h3>
              <ul className="list-disc list-inside mb-4">
                <li><strong>To Reduce High Turbidity:</strong></li>
                <li>Use mechanical filters such as mesh, sand, or cartridge filters.</li>
                <li>Allow water to settle in tanks before use to let suspended solids sink.</li>
                <li>Avoid using water from visibly murky or algae-contaminated sources.</li>
              </ul>

              <h3 className="font-semibold mt-4">🧪 pH Adjustment </h3>
              <ul className="list-disc list-inside mb-4">
                <li><strong>To Raise pH (if water is too acidic):</strong></li>
                <li>Apply agricultural lime (calcium carbonate) or potassium carbonate in measured quantities.</li>
                <li><strong>To Lower pH (if water is too alkaline):</strong></li>
                <li>Use approved acidifying agents such as phosphoric acid, nitric acid, or citric acid.</li>
              </ul>

              <h3 className="font-semibold mt-4">⚡ Total Dissolved Solids (TDS) Management </h3>
              <ul className="list-disc list-inside mb-4">
                <li><strong>To Reduce High TDS:</strong></li>
                <li>Dilute with cleaner water sources.</li>
                <li>Use a reverse osmosis (RO) system to remove excess dissolved solids.</li>
                <li><strong>To Increase Low TDS (nutrient-deficient water):</strong></li>
                <li>Add water-soluble fertilizers through fertigation, tailored to the crop’s needs.</li>
              </ul>

              <h3 className="font-semibold mt-4">🌡️ Temperature Regulation </h3>
              <ul className="list-disc list-inside">
                <li><strong>To Lower Water Temperature:</strong></li>
                <li>Store water in shaded or underground containers to minimize heat absorption.</li>
                <li>Irrigate during early morning or late evening to reduce thermal stress on plants.</li>
              </ul>
            </div>
          </section>


          {/* 5. System Methodology */}
          <section className="break-inside-avoid">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-center">
                ⚙️ 5. System Methodology
              </h2>
              <p className="mb-4">
                Our system uses a combination of sensor technology and machine learning to evaluate water quality for agricultural use. Here's how it works:
              </p>

              <h3 className="font-semibold mt-4">📊 Data Collection</h3>
              <p>
                The system continuously gathers water quality data from sensors measuring temperature, turbidity, pH, and TDS (Total Dissolved Solids). These readings are stored in a database or CSV file, creating a reliable dataset over time.
              </p>

              <h3 className="font-semibold mt-4">🧠 Model Training</h3>
              <p>
                The collected data is preprocessed and divided into training and testing sets. A machine learning model is then trained to assess whether the water is suitable for plant irrigation, based on the patterns and thresholds within this data.
              </p>

              <h3 className="font-semibold mt-4">⏱️ Real-Time Assessment</h3>
              <p>
                Once trained, the model is integrated into the system’s code and used to interpret new sensor readings in real time. Each parameter is tested by the module.
              </p>
              <p>
                If all readings are within safe limits, the water is marked as suitable for irrigation.
              </p>
              <p>
                If any reading exceeds its threshold, the system flags the water as unsuitable, and provides a clear explanation of the issue.
              </p>

              <h3 className="font-semibold mt-4">🖥️ Web Application Display</h3>
              <p>
                Users can view the results directly on the website. The interface shows the live sensor values, water suitability status, and any warnings with helpful insights.
              </p>

              <h3 className="font-semibold mt-4">🔄 Continuous Monitoring & Updates</h3>
              <p>
                New sensor readings are regularly added to the database to build a richer dataset over time. However, to maintain model stability, these new entries are reviewed but not used to retrain the model immediately. This ensures consistent and dependable decision-making.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

