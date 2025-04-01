import { useState } from 'react';
import { Composed, IType, Ref, Type, Union } from 'apollo-conn-gen/oas';
import { OasGen } from 'apollo-conn-gen';
import { EventDataNode, Key } from 'rc-tree/lib/interface';
import _ from 'lodash';

export type TreeData = Node[];

export type CheckedProps = {
  checked: Key[];
  halfChecked: Key[];
};

export type Node = {
  title: string;
  key: string;
  isLeaf: boolean;
  children?: Node[];
  parent?: Node;
  disableCheckbox?: boolean;
  checked?: boolean;
  className?: string;
};

export function useOasTree(
  parser: OasGen,
  onChange: (paths: string[], schema: string) => void
) {
  const types: IType[] = Array.from(parser.paths.values());

  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<TreeData>([]);
  const [checkedKeys, setCheckedKeys] = useState<CheckedProps>({
    checked: [],
    halfChecked: [],
  });

  const onLoadData = async ({ key }: Node) => {
    const newTreeData: TreeData = [...treeData];
    const parent = findNode(newTreeData, key);

    let result: IType[] = [];
    if (!parent?.parent) {
      // we are in the root node
      const typeNode = findPath(key);
      if (typeNode) result = expandType(typeNode as IType);
    } else {
      // we are in a child node, but still a parent
      const typeNode = findPath(key);
      if (typeNode) result = expandType(typeNode as IType);
    }

    const children = parent?.children?.map((c) => c.key) || [];

    result
      .filter((i) => !children.includes(i.path()))
      .forEach((item: IType) => {
        const newNode: Node = createNode(item, parent);

        if (parent) {
          parent.isLeaf = false;
          if (parent.children) {
            parent.children.push(newNode);
          } else {
            parent.children = [newNode];
          }

          if (newNode.checked) {
            setCheckedKeys({
              checked: [...checkedKeys.checked, newNode.key],
              halfChecked: checkedKeys.halfChecked,
            });
          }
        }
      });

    setTreeData(newTreeData);
    await undefined;
  };

  const findNode = (
    items: Node[] | undefined,
    key: string
  ): Node | undefined => {
    if (!items) {
      return;
    }

    for (const item of items) {
      if (item.key === key) {
        return item;
      }

      // Test children recursively
      const child: Node | undefined = findNode(item.children, key);
      if (child) {
        return child;
      }
    }
  };

  const createNode = (item: IType, root: Node | undefined): Node => {
    const isScalarOrEnum =
      item.id.startsWith('prop:scalar') || item.id.startsWith('enum:');

    // get all paths (without the expansion wildcard)
    const paths = selectedPaths.map((p) => p.split('>')[0]);
    const op = item.path().split('>')[0];
    console.log('[web] op', op, 'paths', paths, 'selectedPaths', selectedPaths);

    // debugger;

    return {
      title: item.forPrompt(parser.context!),
      key: item.path(),
      isLeaf: isScalarOrEnum,
      disableCheckbox: !isScalarOrEnum || selectedPaths.includes(op),
      parent: root,
      className: isScalarOrEnum ? 'container-node' : 'leaf-node',
    };
  };

  const findPath = (path: string): IType | boolean => {
    let collection: IType[] = Array.from(parser.paths.values());
    let current: IType | undefined;
    let last: IType | undefined;

    let i = 0;
    const parts = path.split('>');
    do {
      const part = parts[i].replace(/#\/c\/s/g, '#/components/schemas');
      current = collection.find((t) => t.id === part);
      if (!current) {
        throw new Error(
          'Could not find type: ' +
            part +
            ' from ' +
            path +
            ', last: ' +
            last?.pathToRoot()
        );
      }

      // make sure we expand it before we move on to the next part
      parser.expand(current);
      last = current;

      collection =
        Array.from(current!.children.values()) ||
        Array.from(current!.props.values()) ||
        [];

      i++;
    } while (i < parts.length);

    return current;
  };

  const onCheck = (
    values: Key[] | CheckedProps,
    eventObj?: React.MouseEvent
  ): void => {
    const set = new Set<string>(selectedPaths);

    const eventClass =
      (_.get(
        eventObj?.nativeEvent?.target,
        'className'
      ) as unknown as string) ?? '';

    const eventNode = _.get(eventObj, 'node') as unknown as Node;

    if (eventClass.includes('rc-tree-title') && !eventNode.parent) {
      return;
    }

    // add all the parent nodes from the checked nodes
    // needed for the backend to generate the answers
    if (typeof values === 'object') {
      const checkedProps: CheckedProps = values as CheckedProps;

      const added: Key | undefined = _.first(
        _.difference(checkedProps.checked, checkedKeys.checked)
      );

      if (added) {
        const node = findNode(treeData, added as string);
        if (!node?.parent) {
          set.add(added + '>**');

          // now iterate recursively through all the children and disable the checkbox
          const disableChildren = (n: Node) => {
            if (n.children) {
              n.children.forEach((c) => {
                c.disableCheckbox = true;
                disableChildren(c);
              });
            }
          };

          if (node) disableChildren(node);
        } else {
          // it's a leaf node
          set.add(added as string);
        }
      }

      // now process the removed ones
      const removed = _.first(
        _.difference(checkedKeys.checked, checkedProps.checked)
      );

      if (removed) {
        const node = findNode(treeData, removed as string);
        if (!node?.parent) {
          set.delete(removed + '>**');

          // now iterate recursively through all the children and disable the checkbox
          const enableChildren = (n: Node) => {
            if (n.children) {
              n.children.forEach((c) => {
                const id = c.key.substring(c.key.lastIndexOf('>') + 1);
                const isScalarOrEnum =
                  id.startsWith('prop:scalar') || id.startsWith('enum:');

                c.disableCheckbox = !isScalarOrEnum;
                enableChildren(c);
              });
            }
          };

          if (node) enableChildren(node);
        } else {
          set.delete(removed as string);
        }
      }

      console.log('[web] added', added, 'removed', removed);

      setCheckedKeys({
        checked: [...checkedProps.checked],
        halfChecked: checkedProps.halfChecked,
      });

      const newPaths = Array.from(set);
      setSelectedPaths(newPaths);

      // reset generated state
      parser.context?.generatedSet.clear();
      console.log('[web] paths', newPaths);
      onChange(newPaths, parser.generateSchema(newPaths));
    }
  };

  const getId = (key: string) => key.substring(key.lastIndexOf('>') + 1);

  const selectAllScalars = (info: {
    event: React.MouseEvent;
    node: EventDataNode<Node>;
  }) => {
    console.log('[web] right click', info.event, info.node);
    const n = findNode(treeData, info.node.key);
    if (!n) return;

    const id = n.key.substring(n.key.lastIndexOf('>') + 1);

    if (id.startsWith('obj:') || id.startsWith('comp:')) {
      const keys: Key[] | undefined = n.children
        ?.filter((n: Node) => getId(n.key as string).startsWith('prop:scalar'))
        .map((c) => c.key);

      onCheck(
        {
          // eslint-disable-next-line no-unsafe-optional-chaining
          checked: [...checkedKeys?.checked, ...keys!],
          halfChecked: checkedKeys.halfChecked,
        },
        undefined as unknown as React.MouseEvent
      );
    }
  };

  function expandType(type?: IType): IType[] {
    if (!type) {
      return types;
    }

    let result: IType[] = [];

    if (type instanceof Composed || type instanceof Union) {
      // make sure we gather all the props
      (type as Composed | Union).consolidate([]);
      result = Array.from(type.props.values());
    } else {
      // top level paths
      result = parser.expand(type);

      if (result.length === 1) {
        // we are checking for a ref so we can go straight to where its pointing
        const child = result[0];

        if (!(child as Type).visited) {
          child.visit(parser.context!);
        }

        if (child instanceof Ref) {
          result = [child.refType!];
        }
      }
    }

    return result;
  }

  return {
    treeData,
    setTreeData,
    selectedPaths,
    setSelectedPaths,
    onLoadData,
    checkedKeys,
    setCheckedKeys,
    onCheck,
    selectAllScalars,
  };
}
