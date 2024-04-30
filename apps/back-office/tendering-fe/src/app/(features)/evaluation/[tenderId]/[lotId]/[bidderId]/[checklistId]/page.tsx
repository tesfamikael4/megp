import { Section } from '@megp/core-fe';

export default function ChecklistDetail() {
  return (
    <Section
      title="The Bid Opening Team has opened each bid"
      collapsible={false}
      className="h-full overflow-scroll"
    >
      <embed
        src={'https://arxiv.org/pdf/1708.08021.pdf'}
        type="application/pdf"
        width="100%"
        height="400px"
      />
    </Section>
  );
}
