import * as THREE from "three";
//import { CSG } from "@hi-level/three-csg";

export function ThreeInit(camera, scene, renderer) {
  console.log("threeInit");

  var GridHelper = new THREE.GridHelper(1000, 100);
  //  y z axis exchange
  GridHelper.rotation.set(Math.PI / 2, 0, 0);
  scene.add(GridHelper);

  var AxesHelper = new THREE.AxesHelper(30);
  AxesHelper.position.set(0, 0, 0.1);
  scene.add(AxesHelper);

  var light = new THREE.AmbientLight(0x000000);
  scene.add(light);

  var lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);
  lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  lights[2] = new THREE.PointLight(0xffffff, 1, 0);
  lights[3] = new THREE.PointLight(0xffffff, 1, 0);
  lights[4] = new THREE.PointLight(0xffffff, 1, 0);
  lights[5] = new THREE.PointLight(0xffffff, 1, 0);
  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);
  lights[3].position.set(0, -200, 0);
  lights[4].position.set(0, 0, 200);
  lights[5].position.set(200, 0, 0);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);
  scene.add(lights[3]);
  scene.add(lights[4]);
  scene.add(lights[5]);

  let materialArray = [];
  let texture_ft = new THREE.TextureLoader().load("arid2_ft.jpg");
  let texture_bk = new THREE.TextureLoader().load("arid2_bk.jpg");
  let texture_up = new THREE.TextureLoader().load("arid2_up.jpg");
  let texture_dn = new THREE.TextureLoader().load("arid2_dn.jpg");
  let texture_rt = new THREE.TextureLoader().load("arid2_rt.jpg");
  let texture_lf = new THREE.TextureLoader().load("arid2_lf.jpg");

  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

  for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

  let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  let skybox = new THREE.Mesh(skyboxGeo, materialArray);
  skybox.rotation.set(Math.PI / 2, 0, 0);
  scene.add(skybox);
}

export function DrawRamenFix(
  ramenWidth,
  ramenColumnXY,
  ramenBeamZ,
  height,
  spanLength,
  pivotMode,
  floor,
  floorHeight
) {
  var adjustedFloor = floor - 1;
  var ramenPosZ;
  var ramenPivotCenter;
  var spanLengthFix;

  switch (pivotMode) {
    case 0:
      ramenPosZ = -ramenColumnXY / 2;
      ramenPivotCenter = ramenColumnXY / 2;
      spanLengthFix = spanLength;
      break;
    case 1:
      ramenPosZ = ramenColumnXY / 2;
      ramenPivotCenter = -ramenColumnXY / 2;
      spanLengthFix = spanLength + ramenColumnXY;
      break;

    default:
      break;
  }

  var pivotGeo = new THREE.SphereGeometry(1, 15, 15);
  var pivotMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    wireframe: true
  });
  var pivotPoint = new THREE.Mesh(pivotGeo, pivotMat);
  pivotPoint.position.set(spanLengthFix, 0, adjustedFloor * floorHeight);

  var beamPivot = new THREE.Mesh(pivotGeo, pivotMat);
  beamPivot.position.set(0, 0, height - ramenBeamZ);

  var ramenPivot = new THREE.Mesh(pivotGeo, pivotMat);
  ramenPivot.position.set(0, 0, 0);

  var ramenPivot1 = new THREE.Mesh(pivotGeo, pivotMat);
  ramenPivot1.position.set(ramenWidth, 0, 0);

  var mat = new THREE.MeshLambertMaterial({
    color: 0xc0c0c0,
    // wireframe: true
    transparent: true,
    opacity: 0.5
  });

  //Ramen Beam
  var rbgeometry = new THREE.BoxGeometry(ramenWidth, ramenColumnXY, ramenBeamZ);

  var ramenBeam = new THREE.Mesh(rbgeometry, mat);
  ramenBeam.position.set(ramenWidth / 2, ramenPosZ, ramenBeamZ / 2);

  //first Ramen Column
  var geometry1 = new THREE.BoxGeometry(
    ramenColumnXY,
    ramenColumnXY,
    height - ramenBeamZ
  );

  var ramenCol1 = new THREE.Mesh(geometry1, mat);
  ramenCol1.position.set(
    ramenColumnXY / 2,
    ramenPosZ,
    (height - ramenBeamZ) / 2
  );

  //second Ramen Column
  var geometry2 = new THREE.BoxGeometry(
    ramenColumnXY,
    ramenColumnXY,
    height - ramenBeamZ
  );

  var ramenCol2 = new THREE.Mesh(geometry2, mat);
  ramenCol2.position.set(
    -ramenColumnXY / 2,
    ramenPosZ,
    (height - ramenBeamZ) / 2
  );

  var col1Rebar = ramenColumnRebar(
    ramenColumnXY,
    height - ramenBeamZ,
    height,
    0.2,
    5,
    0.2,
    3,
    1,
    0
  );
  ramenPivot.add(col1Rebar);

  var col2Rebar = ramenColumnRebar(
    ramenColumnXY,
    height - ramenBeamZ,
    height,
    0.2,
    5,
    0.2,
    3,
    1,
    1
  );
  ramenPivot1.add(col2Rebar);

    var beamRebar = ramenBeamRebar(
      ramenWidth,
      ramenBeamZ,
      0.2,
      5,
      0.2,
      5,
      1
    );


  beamPivot.add(beamRebar)
  beamPivot.add(ramenBeam);
  pivotPoint.add(beamPivot);
  ramenPivot.add(ramenCol1);
  //pivotPoint.add(ramenCol1);
  ramenPivot1.add(ramenCol2);
  pivotPoint.add(ramenPivot);
  pivotPoint.add(ramenPivot1);
  //pivotPoint.add(tramenBeam)
  //pivotPoint.rotation.set(0, 0, Math.PI / 2);

  // 다커짐 ....
  //pivotPoint.scale.set(2, 1 ,1)

  // 부분 만 커지게 .....
  //ramenBeam.scale.set(2, 1 ,1)

  // var result = {
  //   floor: floor,
  //   nodes: [
  //     [
  //       ramenPivotCenter + spanLength,
  //       ramenColumnXY / 2,
  //       adjustedFloor * floorHeight
  //     ],
  //     [
  //       ramenPivotCenter + spanLength,
  //       ramenColumnXY / 2,
  //       height - ramenBeamZ / 2 + adjustedFloor * floorHeight
  //     ],
  //     [
  //       ramenPivotCenter + spanLength,
  //       ramenWidth - ramenColumnXY / 2,
  //       height - ramenBeamZ / 2 + adjustedFloor * floorHeight
  //     ],
  //     [
  //       ramenPivotCenter + spanLength,
  //       ramenWidth - ramenColumnXY / 2,
  //       adjustedFloor * floorHeight
  //     ]
  //   ]
  // };
  // ramenNodeArr.push(result)

  // Section["1"] = {
  //   "name":"rahmen",
  //   "width":ramenColumnXY,
  //   "depth":ramenColumnXY,
  //   "height":height
  // }

  return pivotPoint;
}

export function DrawSlabFix(
  slabX,
  slabY,
  slabZ,
  floorHeight,
  floor,
  lc,
  rc,
  load
) {
  var pivotGeo = new THREE.SphereGeometry(1, 15, 15);
  var pivotMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    // wireframe: true
    transparent: true,
    opacity: 0.5
  });
  var pivotPoint = new THREE.Mesh(pivotGeo, pivotMat);

  pivotPoint.position.set(0, 0, floorHeight * floor);

  //first Ramen Column
  console.log(`slabX is ${slabX}`);
  var geometry1 = new THREE.BoxGeometry(slabX, slabY, slabZ);
  var material1 = new THREE.MeshLambertMaterial({
    color: 0xc0c0c0,
    // wireframe: true
    transparent: true,
    opacity: 0.5
  });
  var slabMesh = new THREE.Mesh(geometry1, material1);
  slabMesh.position.set(slabX / 2, -slabY / 2, -slabZ / 2);

  pivotPoint.add(slabMesh);

  // var tubegeometry = new THREE.TorusGeometry(10, 0.3, 26, 32);
  // var tubematerial = new THREE.MeshStandardMaterial({
  //   color: 0x346644,
  //   // wireframe: true
  //   transparent: true,
  //   opacity: 0.5
  // });
  // var tubeMesh = new THREE.Mesh(tubegeometry, tubematerial)

  //pivotPoint.add(tubeMesh)

  // lc, rc 가 존재할경우 추가해서 , pivot point 의 자식으로 넣어주자

  if (lc !== 0 && lc !== undefined) {
    var geometry = new THREE.BoxGeometry(slabX, lc, slabZ);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffbb00,
      wireframe: true
    });
    var lcMesh = new THREE.Mesh(geometry, material);
    lcMesh.position.set(slabX / 2, lc / 2, -slabZ / 2);
    pivotPoint.add(lcMesh);
  }

  if (rc !== 0 && rc !== undefined) {
    var geometry = new THREE.BoxGeometry(slabX, rc, slabZ);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffbb00,
      wireframe: true
    });
    var rcMesh = new THREE.Mesh(geometry, material);
    rcMesh.position.set(slabX / 2, -rc / 2 - slabY, -slabZ / 2);
    pivotPoint.add(rcMesh);
  }

  //var rebarG = drawRebar(rc+lc+slabX , slabZ , slabZ/2 )
  var rebarG = drawRebar(
    slabY,
    slabX + rc + lc,
    slabZ,
    1,
    10,
    1,
    10,
    2,
    lc,
    rc
  );

  pivotPoint.add(rebarG);

  pivotPoint.rotation.set(0, 0, Math.PI / 2);

  // var result = {
  //   floor: floor,
  //   nodes: [
  //     [-lc, 0, floor * floorHeight - slabZ],
  //     [slabY + rc, 0, floor * floorHeight - slabZ],
  //     [slabY + rc, slabX, floor * floorHeight - slabZ],
  //     [-lc, slabX, floor * floorHeight - slabZ]
  //   ],
  //   loads: load
  // };
  // slabNodeArr.push(result);

  // Section["2"] = {
  //   name: "slab",
  //   width: slabY,
  //   depth: slabX,
  //   height: slabZ
  // };

  return pivotPoint;
}

// 길이가 긴 방향 lng ,    직선이 lng ,,, 짧은 방향이 감싼다.
// width , height 나 여러가지 인자등이 커버 틱니스의 영향을 받아야함 ...
function drawRebar(
  slabY,
  width,
  height,

  lngRad,
  lngSpan,
  latRad,
  latSpan,
  coverThickness,
  lc,
  rc
) {
  // 그냥 그룹의 위치를 바꿀까 ???

  var group = new THREE.Group();
  //group.position.set(-lc+coverThickness, 0, 0)

  var widthC = width - 2 * coverThickness;
  var depthC = slabY - 2 * coverThickness;
  var heightC = height - 2 * coverThickness;

  var insideBoxGeo = new THREE.BoxGeometry(widthC, depthC, heightC);
  var insideMat = new THREE.MeshBasicMaterial({
    color: 0x777777,
    //wireframe: true,
    transparent: true,
    opacity: 0.5
    //visible: false
  });
  var insideBox = new THREE.Mesh(insideBoxGeo, insideMat);
  insideBox.position.set(width / 2 - lc, slabY / 2, -height / 2);
  group.add(insideBox);

  var material = new THREE.LineBasicMaterial({
    color: 0xf2f2f2
  });

  var numOfLatRebar = width / latSpan;
  for (let index = 1; index < numOfLatRebar; index++) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(
        coverThickness - lc,
        coverThickness,
        -coverThickness - (latRad / 2 + lngRad / 2)
      ),
      new THREE.Vector3(
        coverThickness - lc,
        slabY - coverThickness,
        -coverThickness - (latRad / 2 + lngRad / 2)
      ),

      new THREE.Vector3(
        coverThickness - lc,
        coverThickness,
        -heightC - coverThickness + (latRad / 2 + lngRad / 2)
      ),
      new THREE.Vector3(
        coverThickness - lc,
        slabY - coverThickness,
        -heightC - coverThickness + (latRad / 2 + lngRad / 2)
      )
    );
    var line = new THREE.LineSegments(geometry, material);
    line.position.set(index * latSpan, 0, 0);

    group.add(line);
    //insideBox.add(line);
  }

  // coverthickness 로 줄어든 내부상자의 비주얼화 필요 ....

  var mat = new THREE.LineBasicMaterial({ color: "#f2f2f2" });

  // solid line

  var numOfLngRebar = slabY / lngSpan;
  for (let index = 0; index <= numOfLngRebar; index++) {
    //var line = new THREE.Line(geometryPoints, mat);
    var line = new THREE.Line(
      filletPolyline(
        makeStirrup(heightC, widthC, heightC, latRad),
        heightC / 2,
        50
      ),
      mat
    );

    line.position.set(
      coverThickness - lc,
      index * lngSpan,
      -coverThickness - heightC
    );
    if (index === 0) {
      line.position.set(
        coverThickness - lc,
        index * lngSpan + coverThickness + latRad,
        -coverThickness - heightC
      );
    } else if (index === numOfLngRebar) {
      line.position.set(
        coverThickness - lc,
        index * lngSpan - coverThickness,
        -coverThickness - heightC
      );
    }
    line.rotation.set(Math.PI / 2, 0, 0);
    line.scale.set(1, 1, 1);
    //group.add(line);
    group.add(line);
  }

  //group.add(line);
  group.rotation.set(0, 0, -Math.PI / 2);

  return group;
}

function ramenBeamRebar(
  beamWidth,
  beamHeight,
  lngRad,
  lngSpan,
  latRad,
  latSpan,
  coverThickness,
){
  var group = new THREE.Group();

  var groupC = new THREE.Group();

  var widthC = beamWidth - 2 * coverThickness;
  var depthC = beamHeight - 2 * coverThickness;
  var heightC = beamHeight - 2 * coverThickness;

  group.add(groupC);
  groupC.position.set(coverThickness, -beamHeight/2, beamHeight/2);


  var insideBoxGeo = new THREE.BoxGeometry(widthC, depthC, heightC);
  var insideMat = new THREE.MeshBasicMaterial({
    color: 0x777777,
    //wireframe: true,
    transparent: true,
    opacity: 0.5
    //visible: false
  });
  var insideBox = new THREE.Mesh(insideBoxGeo, insideMat);
  //insideBox.position.set(width / 2 - lc, slabY / 2, -height / 2);
  insideBox.position.set(widthC/2, 0,0);

  groupC.add(insideBox);

  var mat = new THREE.LineBasicMaterial({ color: "#f2f2f2" });

  var numOfLatRebar = widthC / latSpan;
  console.log(numOfLatRebar);
  for (let index = 0; index <= numOfLatRebar; index++) {
    var line = new THREE.Line(
      filletPolyline(
        makeStirrup(depthC, heightC, latRad * 5, latRad),
        latRad * 3,
        50
      ),
      mat
    );
    line.position.set(index*latSpan,-depthC/2,depthC/2);
    line.rotation.set(0, Math.PI/2 , 0)
    groupC.add(line);

    if (index === Math.floor(numOfLatRebar)) {
      var line = new THREE.Line(
        filletPolyline(
          makeStirrup(depthC, heightC, latRad * 5, latRad),
          latRad * 3,
          50
        ),
        mat
      );
      console.log("it happened");

      line.position.set(widthC-latRad,-depthC/2,depthC/2);
      line.rotation.set(0, Math.PI/2 , 0)
      groupC.add(line);
    }

  }



  // 유저 입력 변수에서 -1 
  var numOfLngRebar = 4
  // var points = [[widthC / 2, widthC / 2], [widthC / 2, -widthC / 2]];

  // 정사각형이라 가능 widthC/2 
  //var spanLength = (points[0][0] + points[1][0]) /numOfLngRebar
  
  console.log(`spanlength : ${spanLength}`)
  
  
  var widthCRad = widthC-latRad*3
  var heightCRad = heightC-latRad*3
  var depthCRad = depthC-latRad*3
  console.log(`depthCRad : ${depthCRad}`)
  var spanLength = depthCRad /numOfLngRebar

  var geometry = new THREE.Geometry();

  for (let index = 0; index <= numOfLngRebar; index++) {
    geometry.vertices.push(
      new THREE.Vector3(
        0  , depthCRad/2 -index*spanLength  , depthCRad/2
      ),
      new THREE.Vector3(
        widthC, depthCRad/2 -index*spanLength ,depthCRad/2
      ),

      new THREE.Vector3(
        0  , -depthCRad/2 + index*spanLength , -depthCRad/2
      ),
      new THREE.Vector3(
        widthC, -depthCRad/2+ index*spanLength,-depthCRad/2
      ),

      new THREE.Vector3(
        0  , -depthCRad/2  , depthCRad/2-index*spanLength
      ),
      new THREE.Vector3(
        widthC, -depthCRad/2 ,depthCRad/2-index*spanLength
      ),

      new THREE.Vector3(
        0  , depthCRad/2  , -depthCRad/2+index*spanLength
      ),
      new THREE.Vector3(
        widthC, depthCRad/2 ,-depthCRad/2+index*spanLength
      ),
    )
    
  }





  var line = new THREE.LineSegments(geometry, mat);
  //line.rotation.set(0, Math.PI/2 , 0)
  groupC.add(line);

  return group;
}

function ramenColumnRebar(
  colXY,
  colHeight,
  height,
  lngRad,
  lngSpan,
  latRad,
  latSpan,
  coverThickness,
  pivotMode
) {
  var pivotX;
  switch (pivotMode) {
    case 0:
      pivotX = colXY / 2;
      break;
    case 1:
      pivotX = -colXY / 2;
      break;

    default:
      break;
  }

  var group = new THREE.Group();

  var groupC = new THREE.Group();

  group.add(groupC);
  groupC.position.set(pivotX, -colXY / 2, coverThickness);

  var widthC = colXY - 2 * coverThickness;
  var depthC = colXY - 2 * coverThickness;
  var heightC = height - 2 * coverThickness;

  var insideBoxGeo = new THREE.BoxGeometry(widthC, depthC, heightC);
  var insideMat = new THREE.MeshBasicMaterial({
    color: 0x777777,
    //wireframe: true,
    transparent: true,
    opacity: 0.5
    //visible: false
  });
  var insideBox = new THREE.Mesh(insideBoxGeo, insideMat);
  //insideBox.position.set(width / 2 - lc, slabY / 2, -height / 2);
  insideBox.position.set(0, 0, heightC / 2);

  groupC.add(insideBox);

  var mat = new THREE.LineBasicMaterial({ color: "#f2f2f2" });

  var numOfLatRebar = heightC / latSpan;
  console.log(numOfLatRebar);
  for (let index = 0; index <= numOfLatRebar; index++) {
    var line = new THREE.Line(
      filletPolyline(
        makeStirrup(widthC, widthC, latRad * 5, latRad),
        latRad * 3,
        50
      ),
      mat
    );
    line.position.set(-widthC / 2, -widthC / 2, index * latSpan);

    if (index === Math.floor(numOfLatRebar)) {
      console.log("it happened");

      line.position.set(-widthC / 2, -widthC / 2, colHeight - coverThickness);
      groupC.add(line);
    }

    groupC.add(line);
  }

  

 
  // 유저 입력 변수에서 -1 
  var numOfLngRebar = 4
  // var points = [[widthC / 2, widthC / 2], [widthC / 2, -widthC / 2]];

  // 정사각형이라 가능 widthC/2 
  //var spanLength = (points[0][0] + points[1][0]) /numOfLngRebar
  
  console.log(`spanlength : ${spanLength}`)
  
  
  var widthCRad = widthC-latRad*3
  var spanLength = widthCRad /numOfLngRebar

  var geometry = new THREE.Geometry();

  for (let index = 0; index <= numOfLngRebar; index++) {
    geometry.vertices.push(
      new THREE.Vector3(
        (widthCRad/2 - index*spanLength)  , widthCRad/2  , 0
      ),
      new THREE.Vector3(
        (widthCRad/2 - index*spanLength), widthCRad/2 , heightC
      ),
      new THREE.Vector3(
        (widthCRad/2 - index*spanLength) , -widthCRad/2 , 0
      ),
      new THREE.Vector3(
        (widthCRad/2 - index*spanLength), -widthCRad/2 , heightC
      ),

      new THREE.Vector3(
        widthCRad/2  , widthCRad/2 -index*spanLength  , 0
      ),
      new THREE.Vector3(
        widthCRad/2 , widthCRad/2 -index*spanLength, heightC
      ),

      new THREE.Vector3(
        -widthCRad/2  , widthCRad/2 -index*spanLength  , 0
      ),
      new THREE.Vector3(
        -widthCRad/2 , widthCRad/2 -index*spanLength, heightC
      ),
    )
    
  }

  // for (let index = 0; index <= numOfLngRebar; index++) {
  //   geometry.vertices.push(
  //     new THREE.Vector3(
  //       (widthC/2 - index*spanLength)  - adjustmentRad, widthC/2 -adjustmentRad , 0
  //     ),
  //     new THREE.Vector3(
  //       (widthC/2 - index*spanLength)- adjustmentRad, widthC/2- adjustmentRad , heightC
  //     ),
  //     new THREE.Vector3(
  //       (widthC/2 - index*spanLength)+ adjustmentRad , -widthC/2+ adjustmentRad , 0
  //     ),
  //     new THREE.Vector3(
  //       (widthC/2 - index*spanLength)+ adjustmentRad, -widthC/2+ adjustmentRad , heightC
  //     ),

  //     new THREE.Vector3(
  //       widthC/2- adjustmentRad  , widthC/2 -index*spanLength- adjustmentRad  , 0
  //     ),
  //     new THREE.Vector3(
  //       widthC/2 - adjustmentRad, widthC/2 -index*spanLength- adjustmentRad, heightC
  //     ),

  //     new THREE.Vector3(
  //       -widthC/2+ adjustmentRad  , widthC/2 -index*spanLength+ adjustmentRad  , 0
  //     ),
  //     new THREE.Vector3(
  //       -widthC/2 + adjustmentRad, widthC/2 -index*spanLength+ adjustmentRad, heightC
  //     ),
  //   )
    
  // }




  // geometry.vertices.push(
  //   new THREE.Vector3(
  //     -widthC / 2 + adjustmentRad,
  //     -widthC / 2 + adjustmentRad,
  //     0
  //   ),
  //   new THREE.Vector3(
  //     -widthC / 2 + adjustmentRad,
  //     -widthC / 2 + adjustmentRad,
  //     heightC
  //   ),

  //   new THREE.Vector3(widthC / 2, widthC / 2, 0),
  //   new THREE.Vector3(widthC / 2, widthC / 2, heightC),

  //   new THREE.Vector3(-widthC / 2, widthC / 2, 0),
  //   new THREE.Vector3(-widthC / 2, widthC / 2, heightC),

  //   new THREE.Vector3(widthC / 2, -widthC / 2, 0),
  //   new THREE.Vector3(widthC / 2, -widthC / 2, heightC)
  // );

  var line = new THREE.LineSegments(geometry, mat);
  groupC.add(line);

  return group;
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
}

// export function RebarTest() {
//   var extrudeSettings = {
//     depth: 8,
//     bevelEnabled: true,
//     bevelSegments: 2,
//     steps: 2,
//     bevelSize: 1,
//     bevelThickness: 1
//   };
//   var x = 0;
//   var y = 0;
//   var height = 150;
//   var width = 250;
//   var rebarDia = 16;
//   var extend = 50
//   //var stirrup = makeStirrup(height, width, extend, rebarDia)
//   //var line = new THREE.Line(geometry,new THREE.LineBasicMaterial({ color: extrudeSettings }));

//   var rebarResult = new THREE.Line(filletPolyline(makeStirrup(height, width, extend, rebarDia),20,50), new THREE.LineBasicMaterial({ color: '#f2f2f2' }))

//   return rebarResult
// }

function makeStirrup(height, width, extend, rebarDia) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(extend, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, height, 0));
  geometry.vertices.push(new THREE.Vector3(width, height, 0));
  geometry.vertices.push(new THREE.Vector3(width, 0, rebarDia));
  geometry.vertices.push(new THREE.Vector3(0, 0, rebarDia));
  geometry.vertices.push(new THREE.Vector3(0, extend, rebarDia));
  return geometry;
}

function filletPolyline(geometry, radius, smoothness) {
  var points = geometry.vertices;
  var newGeometry = new THREE.Geometry();
  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();
  var vc1 = new THREE.Vector3();
  var vc2 = new THREE.Vector3();
  var center = new THREE.Vector3();
  var ang;
  var l1;

  newGeometry.vertices.push(points[0]);
  for (let i = 1; i < points.length - 1; i++) {
    //console.log(points[i].x);
    v1.subVectors(points[i - 1], points[i]).normalize();
    v2.subVectors(points[i + 1], points[i]).normalize();
    ang = Math.acos(v1.dot(v2));
    l1 = radius / Math.sin(ang / 2);
    v3.addVectors(v1, v2).setLength(l1);
    center.addVectors(points[i], v3);
    var p1 = new THREE.Vector3().addVectors(
      points[i],
      v1.multiplyScalar(radius / Math.tan(ang / 2))
    );
    var p2 = new THREE.Vector3().addVectors(
      points[i],
      v2.multiplyScalar(radius / Math.tan(ang / 2))
    );
    vc1.subVectors(p1, center);
    vc2.subVectors(p2, center);

    newGeometry.vertices.push(p1);
    for (let j = 0; j < smoothness; j++) {
      var dirVec = new THREE.Vector3()
        .addVectors(
          vc1.clone().multiplyScalar(smoothness - j),
          vc2.clone().multiplyScalar(j + 1)
        )
        .setLength(radius);
      newGeometry.vertices.push(new THREE.Vector3().addVectors(center, dirVec));
    }
    newGeometry.vertices.push(p2);
  }
  newGeometry.vertices.push(points[points.length - 1]);

  return newGeometry;
}
