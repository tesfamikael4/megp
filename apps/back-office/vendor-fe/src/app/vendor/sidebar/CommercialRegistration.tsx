import styles from './CommercialRegistration.module.scss';

export function CommercialRegistration(props) {
  return (
    <div className="w-full overflow-hidden overflow-x-auto">
      <table className="min-w-full bg-white">
        <tbody>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Business Name
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              John Doe
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Legal Form of Entity
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Partnership
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Nationality/Country of Registration
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Ethiopia
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Registration Number
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              ORO/SWSH/WLT/6/0004957/2013
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Capital
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              ORO/SWSH/WLT/6/0004957/2013
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Registration date
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Sep 21, 2020
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
