export const transformJSONData = (data) => {
  const segmentArr: any[] = [];
  const familyArr: any[] = [];
  const classArr: any[] = [];
  const codeArr: any[] = [];

  // this will be used to hold existing codes
  const existingSegments = {};
  const existingFamilies = {};
  const existingClasses = {};
  const existingCommodities = {};

  data.forEach((item: any) => {
    const segmentCode = item['Segment'];
    const familyCode = item['Family'];
    const classCode = item['Class'];
    const commodityCode = item['Commodity'];

    if (!existingSegments[segmentCode] && segmentCode) {
      segmentArr.push({
        title: item['Segment Title'],
        code: segmentCode,
        type: 'SEGMENT',
        parentCode: null,
        key: item['Key'],
        definition: item['Segment Definition'],
      });
      existingSegments[segmentCode] = true;
    }

    if (!existingFamilies[familyCode] && familyCode) {
      familyArr.push({
        title: item['Family Title'],
        code: familyCode,
        type: 'FAMILY',
        parentCode: segmentCode,
        key: item['Key'],
        definition: item['Family Definition'],
      });
      existingFamilies[familyCode] = true;
    }

    if (!existingClasses[classCode] && classCode) {
      classArr.push({
        title: item['Class Title'],
        code: classCode,
        type: 'CLASS',
        parentCode: familyCode,
        key: item['Key'],
        definition: item['Item Definition'],
      });
      existingClasses[classCode] = true;
    }

    if (!existingCommodities[commodityCode] && commodityCode) {
      codeArr.push({
        title: item['Commodity Title'],
        code: commodityCode,
        type: 'COMMODITY',
        parentCode: classCode,
        key: item['Key'],
        definition: item['Commodity Definition'],
      });
      existingCommodities[commodityCode] = true;
    }
  });

  return {
    segments: segmentArr,
    families: familyArr,
    classes: classArr,
    commodities: codeArr,
  };
};
