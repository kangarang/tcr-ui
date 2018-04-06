**Note: this section is research. Not required**

## InterPlanetary Linked Data

"a common hash-chain format for distributed data structures" - [Juan Benet](https://www.youtube.com/watch?v=Bqs_LzBjQyk)

[specs](https://github.com/ipld/specs/tree/master/ipld)

[how does cid work? - Protocol Description](https://github.com/ipld/cid#how-does-it-work---protocol-description)

**[highlights](https://github.com/ipld/specs/tree/master/ipld#ipld):**

There are a variety of systems that use merkle-tree and hash-chain inspired datastructures (e.g. git, bittorrent, ipfs, tahoe-lafs, sfsro)

In short, IPLD is JSON documents with named merkle-links that can be traversed

### IPLD defines:

**merkle-links**: the core unit of a merkle-graph

* A link between two objects which is content-addressed with the cryptographic hash of the target object, and embedded in the source object
* A merkle-link is represented in the IPLD object model by a map containing a single key / mapped to a "link value"
* **Merkle Link examples**:

```js
// A link, represented in json as a "link object"
{
  "/": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k"
}

// "/" is the link key
// "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k" is the link value

// Object with link at foo/baz
{
  "foo": {
    "bar": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k", // not a link
    "baz": {"/": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k"} // link
  }
}

// Object with pseudo 'link object' at files/cat.jpg and ACTUAL link at files/cat.jpg/link
{
  "files": {
    "cat.jpg": { // give links properties wrapping them in another object
      "link": {"/": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k"}, // the link
      "mode": 0755,
      "owner": "jbenet"
    }
  }
}
```

**merkle-dag**: any graphs whose edges are merkle-links. dag stands for "directed acyclic graph"

* Objects with merkle-links form a Graph (merkle-graph), which necessarily is both Directed, and which can be counted on to be Acyclic, iff the properties of the cryptographic hash function hold. I.e. a merkle-dag. Hence all graphs which use merkle-linking (merkle-graph) are necessarily also Directed Acyclic Graphs (DAGs, hence merkle-dag).

**merkle-paths**: unix-style paths for traversing merkle-dags with named merkle-links

* A merkle-path is a unix-style path (e.g. /a/b/c/d) which initially dereferences through a merkle-link and allows access of elements of the referenced node and other nodes transitively. It looks into the object, finding the name and resolving the associated merkle-link.
* General purpose filesystems are encouraged to design an object model on top of IPLD that would be specialized for file manipulation and have specific path algorithms to query this model.
* `/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k/a/b/c/d`
  * `ipfs` is a protocol namespace (to allow the computer to discern what to do)
  * `QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k` is a cryptographic hash
  * `a/b/c/d` is a path traversal, as in unix
* Path traversals, denoted with /, happen over two kinds of links:
  * **in-object traversals** traverse data within the same object
  * **cross-object traversals** traverse from one object to another, resolving through a merkle-link

**IPLD Data Model**

* The IPLD Data Model defines a simple JSON-based structure for representing all merkle-dags, and identifies a set of formats to encode the structure into. IPLD is directly compatible with JSON

**IPLD Serialized Formats**

* a set of formats in which IPLD objects can be represented (through multicodec)
* e.g. JSON, CBOR, CSON, YAML, Protobuf, XML, RDF, etc.
* The only requirement is that there MUST be a well-defined one-to-one mapping with the IPLD Canonical format. This is so that data can be transformed from one format to another, and back, without changing its meaning nor its cryptographic hashes

**IPLD Canonical Format**

* a deterministic description on a serialized format that ensures the same logical object is always serialized to the exact same sequence of bits. This is critical for merkle-linking, and all cryptographic applications
* [more details](https://github.com/ipld/specs/tree/master/ipld#canonical-format)

### Data structure examples

Unix Filesystem:

```
{
  "data": "hello world",
  "size": "11"
}
```

Chunked file, split into multiple sub-files:

```
{
  "size": "1424119",
  "subfiles": [
    {
      "link": {"/": "QmAAA..."},
      "size": "100324"
    },
    {
      "link": {"/": "QmAA1..."},
      "size": "120345",
      "repeat": "10"
    },
    {
      "link": {"/": "QmAA1..."},
      "size": "120345"
    },
  ]
}
```

Directory:

```
{
  "foo": {
    "link": {"/": "QmCCC...111"},
    "mode": "0755",
    "owner": "jbenet"
  },
  "cat.jpg": {
    "link": {"/": "QmCCC...222"},
    "mode": "0644",
    "owner": "jbenet"
  },
  "doge.jpg": {
    "link": {"/": "QmCCC...333"},
    "mode": "0644",
    "owner": "jbenet"
  }
}
```

Git blob:

```json
{
  "data": "hello world"
}
```

Git tree:

```json
{
  "foo": {
    "link": { "/": "QmCCC...111" },
    "mode": "0755"
  },
  "cat.jpg": {
    "link": { "/": "QmCCC...222" },
    "mode": "0644"
  },
  "doge.jpg": {
    "link": { "/": "QmCCC...333" },
    "mode": "0644"
  }
}
```

Git commit:

```json
{
  "tree": { "/": "e4647147e940e2fab134e7f3d8a40c2022cb36f3" },
  "parents": [
    { "/": "b7d3ead1d80086940409206f5bd1a7a858ab6c95" },
    { "/": "ba8fbf7bc07818fa2892bd1a302081214b452afb" }
  ],
  "author": {
    "name": "Juan Batiz-Benet",
    "email": "juan@benet.ai",
    "time": "1435398707 -0700"
  },
  "committer": {
    "name": "Juan Batiz-Benet",
    "email": "juan@benet.ai",
    "time": "1435398707 -0700"
  },
  "message": "Merge pull request #7 from ipfs/iprs\n\n(WIP) records + merkledag specs"
}
```
