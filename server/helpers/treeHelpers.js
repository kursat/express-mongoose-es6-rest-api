function injectSources(tree, sources) {
  tree.forEach((node) => {
    if (node.source) {
      const source = sources.find((s) => s._id.toString() === (node.source));
      if (source) node.source = source;
      else node.source = undefined;
    }

    if (node.children) {
      node.children = injectSources(node.children, sources);
    }
  });

  return tree;
}

module.exports = { injectSources };
