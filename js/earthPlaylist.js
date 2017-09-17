window.onload=function(){
      //do something
	var table = [
				"H", "Hydrogen", "1.00794", 1, 1,
				"He", "Helium", "4.002602", 18, 1,
				"Li", "Lithium", "6.941", 1, 2,
				"Be", "Beryllium", "9.012182", 2, 2,
				"B", "Boron", "10.811", 13, 2,
				"C", "Carbon", "12.0107", 14, 2,
				"N", "Nitrogen", "14.0067", 15, 2,
				"O", "Oxygen", "15.9994", 16, 2,
				"F", "Fluorine", "18.9984032", 17, 2,
				"Ne", "Neon", "20.1797", 18, 2,
				"Na", "Sodium", "22.98976...", 1, 3				
				];
	
	var objects = [];
	var targets = { table: [], sphere: [], helix: [], grid: [] };  //构建不同形式的播放列表
	var projector = new THREE.Projector();
	var raycaster;
	var array = [];
	var mouse;
	var INTERSECTED;
	/* detector */
	if(!Detector.webgl) Detector.addGetWebGLMessage();
			
	var renderer	= new THREE.WebGLRenderer({
		antialias	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	document.body.appendChild( renderer.domElement );
	renderer.shadowMapEnabled	= true;
	
	
				
	var onRenderFcts= [];
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
	camera.position.z = 1;

	var light	= new THREE.AmbientLight( 0x222222 );
	scene.add( light );

	var light	= new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set(5,5,5);
	scene.add( light );
	light.castShadow	= true;
	light.shadowCameraNear	= 0.01;
	light.shadowCameraFar	= 15;
	light.shadowCameraFov	= 45;

	light.shadowCameraLeft	= -1;
	light.shadowCameraRight	=  1;
	light.shadowCameraTop	=  1;
	light.shadowCameraBottom= -1;
	// light.shadowCameraVisible	= true

	light.shadowBias	= 0.001;
	light.shadowDarkness	= 0.2;

	light.shadowMapWidth	= 1024;
	light.shadowMapHeight	= 1024;
	
	//////////////////////////////////////////////////////////////////////////////////
	//		added playlist Table							//
	//////////////////////////////////////////////////////////////////////////////////
	//对table内的元素一个个添加到表格中
	for ( var i = 0; i < table.length; i += 5 ) {
		var element = document.createElement( 'div' );
		element.className = 'element';
		element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
		
		var number = document.createElement( 'div' );
		number.className = 'number';
		number.textContent = (i/5) + 1;
		element.appendChild( number );
		
		var symbol = document.createElement( 'div' );
		symbol.className = 'symbol';
		symbol.textContent = table[ i ];
		element.appendChild( symbol );
		
		var details = document.createElement( 'div' );
		details.className = 'details';
		details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
		element.appendChild( details );
		
		var object = new THREE.CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add( object );
		objects.push( object );
		//
		var object = new THREE.Object3D();
		object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
		object.position.y = - ( table[ i + 4 ] * 180 ) + 990;
		targets.table.push( object );
	}
	
	// helix
	var vector = new THREE.Vector3();
	var cylindrical = new THREE.Cylindrical();
	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var theta = i * 0.175 + Math.PI;
		var y = - ( i * 8 ) + 450;
		var object = new THREE.Object3D();
		cylindrical.set( 900, theta, y );
		object.position.setFromCylindrical( cylindrical );
		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;
		object.lookAt( vector );
		targets.helix.push( object );
	}
	// grid
	for ( var i = 0; i < objects.length; i ++ ) {
		var object = new THREE.Object3D();
		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
		targets.grid.push( object );
	}
		
	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.table, 2000 );
	}, false );
	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.sphere, 2000 );
	}, false );
	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.helix, 2000 );
	}, false );
	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.grid, 2000 );
	}, false );
	transform( targets.table, 2000 );
				//
	function transform( targets, duration ) {
		TWEEN.removeAll();
		for ( var i = 0; i < objects.length; i ++ ) {
			var object = objects[ i ];
			var target = targets[ i ];
			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
		}
		new TWEEN.Tween( this )
			.to( {}, duration * 2 )
			.onUpdate( renderer.render )
			.start();
	}
	controls = new THREE.TrackballControls( camera, renderer.domElement );
				controls.rotateSpeed = 0.5;
				controls.minDistance = 500;
				controls.maxDistance = 6000;
				controls.addEventListener( 'change', renderer.render );
	//////////////////////////////////////////////////////////////////////////////////
	//		added starfield							//
	//////////////////////////////////////////////////////////////////////////////////
	
	
	var starSphere	= THREEx.Planets.createStarfield();
	scene.add(starSphere);

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////

	// var datGUI	= new dat.GUI()

	var containerEarth	= new THREE.Object3D();
	containerEarth.rotateZ(-23.4 * Math.PI/180);
	containerEarth.position.z	= 0;
	scene.add(containerEarth);
	
	var earthMesh	= THREEx.Planets.createEarth();
	earthMesh.receiveShadow	= true;
	earthMesh.castShadow	= true;
	containerEarth.add(earthMesh);
	onRenderFcts.push(function(delta, now){
		earthMesh.rotation.y += 1/32 * delta;		
	});
	
	var subSphere;
	subSphere = new THREE.Mesh(
		new THREE.SphereGeometry(0.02, 50, 50),
		new THREE.MeshLambertMaterial({color: 0xCC0000})
	);
	subSphere.receiveShadow	= true;
	subSphere.castShadow	= true;
	containerEarth.add(subSphere);
	subSphere.position.set(0, 0, 0.55);
	
	var pivotPoint = new THREE.Object3D();
	pivotPoint.add(subSphere);			
	earthMesh.add(pivotPoint);	 //将小球绑定在earthmesh上，共享坐标轴
	onRenderFcts.push(function(delta, now){
		subSphere.rotation.y += 1/32 * delta;
	});

	var geometry	= new THREE.SphereGeometry(0.5, 32, 32);
	var material	= THREEx.createAtmosphereMaterial();
	material.uniforms.glowColor.value.set(0x00b3ff);
	material.uniforms.coeficient.value	= 0.8;
	material.uniforms.power.value		= 2.0;
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.01);
	containerEarth.add( mesh );
	// new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)

	var geometry	= new THREE.SphereGeometry(0.5, 32, 32);
	var material	= THREEx.createAtmosphereMaterial();
	material.side	= THREE.BackSide;
	material.uniforms.glowColor.value.set(0x00b3ff);
	material.uniforms.coeficient.value	= 0.5;
	material.uniforms.power.value		= 4.0;
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.15);
	containerEarth.add( mesh );
	// new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)

	var earthCloud	= THREEx.Planets.createEarthCloud();
	earthCloud.receiveShadow	= true;
	earthCloud.castShadow	= true;
	containerEarth.add(earthCloud);
	onRenderFcts.push(function(delta, now){
		earthCloud.rotation.y += 1/8 * delta;		
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0}
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
		mouse.y	= (event.clientY / window.innerHeight) - 0.5;
	}, false);
	onRenderFcts.push(function(delta, now){
		camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3);
		camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3);
		camera.lookAt( scene.position );
	})
	//鼠标点击事件
	function onDocumentMouseDown(event) {
		event.preventDefault();

		var mouseVector = new THREE.Vector3(
			( event.clientX / window.innerWidth ) * 2 - 1,
		  - ( event.clientY / window.innerHeight ) * 2 + 1,
			1 );

		projector.unprojectVector( mouseVector, camera );
		var raycaster = new THREE.Raycaster( camera.position, mouseVector.sub( camera.position ).normalize() );
		console.log("Intersected object:", intersects.length);
		// create an array containing all objects in the scene with which the ray intersects
		var intersects = raycaster.intersectObjects( scene.children );
		console.log(intersects);
		if (intersects.length>0){
			console.log("Intersected object:", intersects.length);
			intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
		}

	}
	document.addEventListener('mousedown', onDocumentMouseDown, false);  //绑定鼠标移入事件
	window.addEventListener('resize', onWindowResize, false);
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null;
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
		lastTimeMsec	= nowMsec;
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000);
		});
	});
	
	
	
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

