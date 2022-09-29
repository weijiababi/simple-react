# 关于 diff 算法的实现

以 preact 举例,其 diff 算法的实质为比对真实 dom 节点与 vnode 节点，并直接操作真实 dom 节点进行更新操作,diff 算法的核心 diffNode 有以下几个重要逻辑

1. 判断输入的 vnode 节点若为空或布尔值（例如 false && <Comp />这种情况,输出为 false 值），则直接返回空

2. 判断输入的 vnode 为字符串，则判断 dom 节点类型 nodeType 是否为字符，并依情况操作 dom 节点内容进行更新，输出差异文本内容，结束（此判断可以说是 diffNode 的最终本质）

3. 判断输入的 vnode 的 tag 为 function 或是 dom 节点为空，则判断为组件切换渲染，需要执行 diffComponent，diffComponent 的实质就是对两者进行判断，若为相同组件类型则直接更新，否则就卸载原组件，并返回新组件

4. 判断输入的 vnode 为 Element 类型(React/create_element.js)，若是则判断与 dom 节点标签是否相同，若不相同，则以 vnode 的标签创建新的文档节点，并将 dom 节点的内容复制到新节点上

5. 判断 dom 及 vnode 下的 children 是否都不为空，若是则进行 diffChildren，diffChildren 实质就是递归遍历调用 diffNode 来比对每个子节点。（由此可引申出为什么 react 的数组遍历为什么要绑定 key？在此步骤的比对中，若对比的 vnode child 有绑定 key，则可以从 dom 的 children 列表中查找绑定了对应 key 的 dom child，提高了对比查找的效率，若 vnode child 未绑定 key，则直接在 dom children 列表中查找有相同文档标签的 dom child 来执行比对，或者是拿取相同数组下标的 dom child 来比对） 特别重要的一点是，因为是递归调用，在最底层的比对都演变成字符串直接的比对(diffNode 的第二步)。另外在 child 的比对结束后，也是根据比对结果来决定是插入，移除，或是替换。

6. 比对 dom 及 vnode 下的属性，以 vnode 属性为准，若 dom 上存在某属性而 vnode 上不存在，则需要移除该属性，然后就是比对相同属性名的值，只有比对不等的属性才执行 setAttribute
