define(["./when-54335d57","./Cartesian2-697a9954","./arrayRemoveDuplicates-db90b85c","./BoundingRectangle-f46bca91","./Transforms-251ff661","./ComponentDatatype-417761a2","./PolylineVolumeGeometryLibrary-82babed3","./Check-f3fec9b0","./GeometryAttribute-7ca1c9e4","./GeometryAttributes-caa08d6c","./GeometryPipeline-1dd54e44","./IndexDatatype-c134ea39","./Math-737a2579","./PolygonPipeline-1048742e","./VertexFormat-acf45ede","./RuntimeError-88a32665","./WebGLConstants-4739ce15","./EllipsoidTangentPlane-ae33ec6a","./AxisAlignedBoundingBox-dcfdb7a9","./IntersectionTests-3e34a0aa","./Plane-d4cb7bb3","./PolylinePipeline-d9c22c71","./EllipsoidGeodesic-efd225af","./EllipsoidRhumbLine-e5c51fa7","./AttributeCompression-ab5c33b7","./EncodedCartesian3-0ae9fe5e"],function(c,u,r,a,A,T,o,e,G,R,D,I,i,B,g,t,n,l,s,d,p,y,m,h,f,b){"use strict";var v={};function O(e,t){c.defined(v[e])||(v[e]=!0,console.warn(c.defaultValue(t,e)))}function E(e){var t=(e=c.defaultValue(e,c.defaultValue.EMPTY_OBJECT)).polylinePositions,n=e.shapePositions;this._positions=t,this._shape=n,this._ellipsoid=u.Ellipsoid.clone(c.defaultValue(e.ellipsoid,u.Ellipsoid.WGS84)),this._cornerType=c.defaultValue(e.cornerType,o.CornerType.ROUNDED),this._vertexFormat=g.VertexFormat.clone(c.defaultValue(e.vertexFormat,g.VertexFormat.DEFAULT)),this._granularity=c.defaultValue(e.granularity,i.CesiumMath.RADIANS_PER_DEGREE),this._workerName="createPolylineVolumeGeometry";t=1+t.length*u.Cartesian3.packedLength;t+=1+n.length*u.Cartesian2.packedLength,this.packedLength=t+u.Ellipsoid.packedLength+g.VertexFormat.packedLength+2}O.geometryOutlines="Entity geometry outlines are unsupported on terrain. Outlines will be disabled. To enable outlines, disable geometry terrain clamping by explicitly setting height to 0.",O.geometryZIndex="Entity geometry with zIndex are unsupported when height or extrudedHeight are defined.  zIndex will be ignored",O.geometryHeightReference="Entity corridor, ellipse, polygon or rectangle with heightReference must also have a defined height.  heightReference will be ignored",O.geometryExtrudedHeightReference="Entity corridor, ellipse, polygon or rectangle with extrudedHeightReference must also have a defined extrudedHeight.  extrudedHeightReference will be ignored",E.pack=function(e,t,n){var i;n=c.defaultValue(n,0);var r=e._positions,a=r.length;for(t[n++]=a,i=0;i<a;++i,n+=u.Cartesian3.packedLength)u.Cartesian3.pack(r[i],t,n);var o=e._shape,a=o.length;for(t[n++]=a,i=0;i<a;++i,n+=u.Cartesian2.packedLength)u.Cartesian2.pack(o[i],t,n);return u.Ellipsoid.pack(e._ellipsoid,t,n),n+=u.Ellipsoid.packedLength,g.VertexFormat.pack(e._vertexFormat,t,n),n+=g.VertexFormat.packedLength,t[n++]=e._cornerType,t[n]=e._granularity,t};var P=u.Ellipsoid.clone(u.Ellipsoid.UNIT_SPHERE),x=new g.VertexFormat,_={polylinePositions:void 0,shapePositions:void 0,ellipsoid:P,vertexFormat:x,cornerType:void 0,granularity:void 0};E.unpack=function(e,t,n){t=c.defaultValue(t,0);for(var i=e[t++],r=new Array(i),a=0;a<i;++a,t+=u.Cartesian3.packedLength)r[a]=u.Cartesian3.unpack(e,t);var i=e[t++],o=new Array(i);for(a=0;a<i;++a,t+=u.Cartesian2.packedLength)o[a]=u.Cartesian2.unpack(e,t);var l=u.Ellipsoid.unpack(e,t,P);t+=u.Ellipsoid.packedLength;var s=g.VertexFormat.unpack(e,t,x);t+=g.VertexFormat.packedLength;var d=e[t++],p=e[t];return c.defined(n)?(n._positions=r,n._shape=o,n._ellipsoid=u.Ellipsoid.clone(l,n._ellipsoid),n._vertexFormat=g.VertexFormat.clone(s,n._vertexFormat),n._cornerType=d,n._granularity=p,n):(_.polylinePositions=r,_.shapePositions=o,_.cornerType=d,_.granularity=p,new E(_))};var k=new a.BoundingRectangle;return E.createGeometry=function(e){var t=e._positions,n=r.arrayRemoveDuplicates(t,u.Cartesian3.equalsEpsilon),i=e._shape,i=o.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(i);if(!(n.length<2||i.length<3)){B.PolygonPipeline.computeWindingOrder2D(i)===B.WindingOrder.CLOCKWISE&&i.reverse();t=a.BoundingRectangle.fromPoints(i,k);return function(e,t,n,i){var r=new R.GeometryAttributes;i.position&&(r.position=new G.GeometryAttribute({componentDatatype:T.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e}));var a,o,l,s,d,p=t.length,c=e.length/3,u=(c-2*p)/(2*p),g=B.PolygonPipeline.triangulate(t),y=(u-1)*p*6+2*g.length,m=I.IndexDatatype.createTypedArray(c,y),h=2*p,f=0;for(C=0;C<u-1;C++){for(a=0;a<p-1;a++)d=(o=2*a+C*p*2)+h,s=(l=o+1)+h,m[f++]=l,m[f++]=o,m[f++]=s,m[f++]=s,m[f++]=o,m[f++]=d;s=(l=(o=2*p-2+C*p*2)+1)+h,d=o+h,m[f++]=l,m[f++]=o,m[f++]=s,m[f++]=s,m[f++]=o,m[f++]=d}if(i.st||i.tangent||i.bitangent){for(var b,v,E=new Float32Array(2*c),P=1/(u-1),x=1/n.height,_=n.height/2,k=0,C=0;C<u;C++){for(v=x*(t[0].y+_),E[k++]=b=C*P,E[k++]=v,a=1;a<p;a++)v=x*(t[a].y+_),E[k++]=b,E[k++]=v,E[k++]=b,E[k++]=v;v=x*(t[0].y+_),E[k++]=b,E[k++]=v}for(a=0;a<p;a++)v=x*(t[a].y+_),E[k++]=b=0,E[k++]=v;for(a=0;a<p;a++)v=x*(t[a].y+_),E[k++]=b=(u-1)*P,E[k++]=v;r.st=new G.GeometryAttribute({componentDatatype:T.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:new Float32Array(E)})}var V=c-2*p;for(C=0;C<g.length;C+=3){var L=g[C]+V,w=g[C+1]+V,F=g[C+2]+V;m[f++]=L,m[f++]=w,m[f++]=F,m[f++]=F+p,m[f++]=w+p,m[f++]=L+p}if(e=new G.Geometry({attributes:r,indices:m,boundingSphere:A.BoundingSphere.fromVertices(e),primitiveType:G.PrimitiveType.TRIANGLES}),i.normal&&(e=D.GeometryPipeline.computeNormal(e)),i.tangent||i.bitangent){try{e=D.GeometryPipeline.computeTangentAndBitangent(e)}catch(e){O("polyline-volume-tangent-bitangent","Unable to compute tangents and bitangents for polyline volume geometry")}i.tangent||(e.attributes.tangent=void 0),i.bitangent||(e.attributes.bitangent=void 0),i.st||(e.attributes.st=void 0)}return e}(o.PolylineVolumeGeometryLibrary.computePositions(n,i,t,e,!0),i,t,e._vertexFormat)}},function(e,t){return(e=c.defined(t)?E.unpack(e,t):e)._ellipsoid=u.Ellipsoid.clone(e._ellipsoid),E.createGeometry(e)}});
