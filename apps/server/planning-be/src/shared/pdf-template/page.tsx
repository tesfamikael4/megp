// 'use client';
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   PDFViewer,
// } from '@react-pdf/renderer';
// const myImg = '/ppda.png';
// const data = [
//   {
//     title: 'Construction of Cancer Centre-contracts',
//     estimatedAmount: 'MKW 5,000.00',
//     identification: [
//       {
//         key: 'Reference',
//         value: 'REF-52724',
//       },
//       {
//         key: 'Name',
//         value: '	Procurement of assorted consumable stores ',
//       },
//       {
//         key: 'description',
//         value:
//           '	The procurement of assorted consumable stores involves the strategic acquisition of a diverse range of items essential for daily operations and consumption. This comprehensive process encompasses sourcing various consumables required for different purposes, ensuring a seamless and well-stocked supply chain. Assorted consumable stores may include a wide array of products such as office supplies, stationery, cleaning materials, pantry items, and other goods integral to the smooth functioning of an organization. Procuring these consumables efficiently requires attention to quality, cost-effectiveness, and supplier reliability. In the realm of office supplies, items like pens, paper, printer cartridges, and notepads are commonly procured. Cleaning materials may encompass cleaning agents, detergents, and maintenance supplies, contributing to a clean and organized workspace. Pantry items, including snacks, beverages, and kitchen supplies, are vital for employee well-being and satisfaction. An effective procurement strategy involves identifying reliable suppliers, negotiating favorable terms, and ensuring timely deliveries. By maintaining an organized inventory and monitoring consumption patterns, organizations can optimize their consumables procurement process, minimizing waste and promoting cost efficiency. In conclusion, the procurement of assorted consumable stores is a dynamic and essential aspect of organizational management. A well-planned approach ensures a constant and reliable supply of necessary items, fostering a conducive and well-equipped environment for daily operations.',
//       },
//       { key: 'Estimated Amount', value: 'MKW 1,393,996.00' },
//       { key: 'Calculated Amount', value: 'MKW 875,623.00' },
//       {
//         key: 'Remark',
//         value:
//           'In conclusion, the procurement of assorted consumable stores is a dynamic and essential aspect of organizational management. A well-planned approach ensures a constant and reliable supply of necessary items, fostering a conducive and well-equipped environment for daily operations.',
//       },
//     ],
//     procurementMethods: [
//       { key: 'Procurement Type', value: 'Goods' },
//       {
//         key: 'Procurement Method',
//         value: 'Request for Quotation (RFQ)',
//       },
//       { key: 'Funding Source', value: 'Treasury' },
//       { key: 'CProcurement Process', value: 'Online' },
//       { key: 'Supplier Target Group', value: 'Others' },
//     ],
//   },
//   {
//     title: 'Construction of Cancer Centre-contracts',
//     estimatedAmount: 'MKW 5,000.00',
//     identification: [
//       {
//         key: 'Reference',
//         value: 'REF-52724',
//       },
//       {
//         key: 'Name',
//         value: '	Procurement of assorted consumable stores ',
//       },
//       {
//         key: 'description',
//         value:
//           '	The procurement of assorted consumable stores involves the strategic acquisition of a diverse range of items essential for daily operations and consumption. This comprehensive process encompasses sourcing various consumables required for different purposes, ensuring a seamless and well-stocked supply chain. Assorted consumable stores may include a wide array of products such as office supplies, stationery, cleaning materials, pantry items, and other goods integral to the smooth functioning of an organization. Procuring these consumables efficiently requires attention to quality, cost-effectiveness, and supplier reliability. In the realm of office supplies, items like pens, paper, printer cartridges, and notepads are commonly procured. Cleaning materials may encompass cleaning agents, detergents, and maintenance supplies, contributing to a clean and organized workspace. Pantry items, including snacks, beverages, and kitchen supplies, are vital for employee well-being and satisfaction. An effective procurement strategy involves identifying reliable suppliers, negotiating favorable terms, and ensuring timely deliveries. By maintaining an organized inventory and monitoring consumption patterns, organizations can optimize their consumables procurement process, minimizing waste and promoting cost efficiency. In conclusion, the procurement of assorted consumable stores is a dynamic and essential aspect of organizational management. A well-planned approach ensures a constant and reliable supply of necessary items, fostering a conducive and well-equipped environment for daily operations.',
//       },
//       { key: 'Estimated Amount', value: 'MKW 1,393,996.00' },
//       { key: 'Calculated Amount', value: 'MKW 875,623.00' },
//       {
//         key: 'Remark',
//         value:
//           'In conclusion, the procurement of assorted consumable stores is a dynamic and essential aspect of organizational management. A well-planned approach ensures a constant and reliable supply of necessary items, fostering a conducive and well-equipped environment for daily operations.',
//       },
//     ],
//     procurementMethods: [
//       { key: 'Procurement Type', value: 'Goods' },
//       {
//         key: 'Procurement Method',
//         value: 'Request for Quotation (RFQ)',
//       },
//       { key: 'Funding Source', value: 'Treasury' },
//       { key: 'CProcurement Process', value: 'Online' },
//       { key: 'Supplier Target Group', value: 'Others' },
//     ],
//   },
// ];

// const ActivityPdf = ({ data }): React.ReactNode => {
//   return (
//     <PDFViewer
//       style={{
//         width: '100%',
//         height: '100vh',
//       }}
//     >
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <Image src={myImg} />
//           <Text style={styles.title}>
//             Annual Procurement Plan 2024 - Pre Budget Plan
//           </Text>

//           {data.map((item, index) => (
//             <View style={styles.activities}>
//               <View
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   backgroundColor: '#f0f0f0',
//                   padding: 5,
//                   fontSize: 12.5,
//                 }}
//               >
//                 <Text style={{ marginTop: 5 }}>{item.title}</Text>
//                 <Text>{item.estimatedAmount}</Text>
//               </View>
//               {/* End Title */}

//               <View style={styles.activity}>
//                 <Text>Identification</Text>
//               </View>
//               <View style={styles.activityDetail}>
//                 <ReactPdfTable data={item.identification} config={{}} />
//               </View>

//               <View style={styles.activity}>
//                 <Text>Procurement Methods</Text>
//               </View>
//               <View style={styles.activityDetail}>
//                 <ReactPdfTable data={item.procurementMethods} config={{}} />
//               </View>
//               <View style={styles.footer}>
//                 <Text style={styles.web}>
//                   {new Date().toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric',
//                   })}
//                 </Text>
//                 <Text style={styles.ppda}>Page {index + 1}</Text>
//               </View>
//             </View>
//           ))}
//         </Page>
//       </Document>
//     </PDFViewer>
//   );
// };

// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: '#ffffff',
//     maxWidth: '100%',
//     height: '100vh',
//   },
//   title: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     marginBottom: 15,
//   },
//   activities: {
//     padding: 10,
//     fontSize: 10,
//   },
//   // title
//   activity: {
//     marginTop: 25,
//     marginBottom: 10,
//     fontSize: 14,
//     marginLeft: 20,
//   },
//   activityDetail: {
//     paddingHorizontal: 20,
//     paddingVertical: 5,
//     fontWeight: 'normal',
//     fontSize: 8,
//   },
//   footer: {
//     padding: 30,
//     flexDirection: 'row',
//     fontSize: 10,
//     bottom: 0,
//   },
//   web: {
//     width: '40%',
//     fontSize: 9,
//     color: 'gray',
//     bottom: 0,
//   },
//   ppda: {
//     width: '60%',
//     textAlign: 'right',
//     color: 'gray',
//     bottom: 0,
//   },
// });

// const ReactPdfTable = ({ data, config }: any) => {
//   return (
//     <View style={tableStyles.table}>
//       {data.map((row: any, i: number) => (
//         <View key={i} style={tableStyles.row}>
//           <Text style={tableStyles.row1}>
//             <Text style={tableStyles.bold}>{row.key}</Text>
//           </Text>
//           <Text style={tableStyles.row2}>{row.value}</Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// const tableStyles = StyleSheet.create({
//   table: {
//     width: '100%',
//     backgroundColor: '#d9d9d9d9',
//     padding: 8,
//   },
//   row: {
//     display: 'flex',
//     flexDirection: 'row',
//     borderTop: '1px solid #EEE',
//     paddingTop: 5,
//     paddingBottom: 5,
//   },
//   header: {
//     borderTop: 'none',
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
//   // So Declarative and unDRY 👌
//   row1: {
//     width: '30%',
//   },
//   row2: {
//     width: '70%',
//   },
// });

// export default ActivityPdf;
