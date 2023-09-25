import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkflowEngineService {
  async convertToStateMachine(uiJson: any) {
    const nodes = uiJson.nodes;
    const edges = uiJson.edges;
    const startNode = nodes.find((node) => node.type === 'start');
    const machine = {};
    machine['id'] = uuidv4();
    machine['initial'] = startNode.data.label;
    machine['states'] = {};
    nodes.forEach((element) => {
      const terminalEdges = edges.filter((e) => element.id === e.source);
      // if (terminalEdges.length > 1) {
      //   console.log(`Terminal ${element.id} edges `, terminalEdges);
      // }
      if (element.type === 'parallel') {
        console.log(`Terminal ${element.id} edges `, terminalEdges);
      }
      const nodeEvents = {};
      const nodeMetaData = {};
      for (const edge of terminalEdges) {
        const label =
          edge.label && edge.label.length > 0
            ? edge.label.toUpperCase()
            : 'SUBMIT';
        nodeEvents[`${label}`] = nodes.find(
          (n) => n.id === edge.target,
        ).data.label;
      }
      const type = element.type && element.type.length > 0 ? element.type : '';
      nodeMetaData[`type`] = type;
      const stateLabel = element.data.label;
      machine['states'][`${stateLabel}`] = {
        on: nodeEvents,
        meta: nodeMetaData,
      };
    });
    //console.log("Machine Nodes", machine);
    return machine;
  }
}
