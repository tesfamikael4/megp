'use client';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';
import { useLazyGetUnitQuery } from '@/store/api/unit/unit.api';
import { useEffect } from 'react';

const TreeNode = ({ node }) => {
  const label = <span>{node.name}</span>;

  if (node.children && node.children.length > 0) {
    return (
      <div className="border-t mt-4">
        <TreeView key={node.id} nodeLabel={label} defaultCollapsed={true}>
          {node.children.map((child) => (
            <>
              <div className="border-b mt-4">
                <TreeNode key={child.id} node={child} />
              </div>
            </>
          ))}
        </TreeView>
      </div>
    );
  }

  return <TreeView key={node.id} nodeLabel={label} />;
};

const TreeViewDetail = () => {
  const [
    triggerUnits,
    { data: units, isLoading: isUnitsLoading, isSuccess: isUnitsSuccess },
  ] = useLazyGetUnitQuery();

  useEffect(() => {
    triggerUnits(true);
  }, [triggerUnits]);
  console.log(units?.items);

  function nested(data, pid = undefined) {
    return data?.reduce((r, e) => {
      if (e.parentId == pid) {
        const obj = { ...e };
        const children = nested(data, e.id);
        if (children.length) obj.children = children;
        r.push(obj);
      }
      // console.log(r)
      return r;
      // console.log(r)
    }, []);
  }
  const result = nested(units?.items);

  console.log(result);

  return (
    <>
      <div>
        <div className="container  mt-4 ">
          {result?.map((node) => <TreeNode key={node.id} node={node} />)}
        </div>
      </div>
    </>
  );
};

export default TreeViewDetail;
