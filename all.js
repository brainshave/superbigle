var Utils;
(function (Utils) {
    var whitespace_both_sides = /^\s+|\s+$/gm;
    function trim_string(str) {
        return String.prototype.replace.call(str, whitespace_both_sides, '');
    }
    Utils.trim_string = trim_string;
    var browser_prefixes = [
        'webkit', 
        'moz', 
        'ms', 
        'o'
    ];
    function get_prefixed_method(object, name) {
        var fn = object[name];
        if(typeof fn === 'function') {
            return fn;
        }
        name = name[0].toUpperCase() + name.substr(1);
        for(var i = 0; i < browser_prefixes.length; ++i) {
            fn = object[browser_prefixes[i] + name];
            if(typeof fn === 'function') {
                return fn.bind(object);
            }
        }
    }
    Utils.get_prefixed_method = get_prefixed_method;
    function load_txt(path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (event) {
            if(xhr.readyState === 4) {
                callback(xhr.responseText);
            }
        };
        xhr.open('GET', path, true);
        xhr.send();
    }
    Utils.load_txt = load_txt;
    function load_many_txts(paths, callback) {
        var to_go = paths.length;
        var texts = [];
        var receive = function (i) {
            var _this = this;
            return function (text) {
                to_go--;
                texts[i] = text;
                if(to_go === 0) {
                    callback.apply(_this, texts);
                }
            }
        };
        for(var i = 0; i < paths.length; ++i) {
            load_txt(paths[i], receive(i));
        }
    }
    Utils.load_many_txts = load_many_txts;
})(Utils || (Utils = {}));

var Shaders;
(function (Shaders) {
    function compile_shader(gl, src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            throw new Error('Shader compile error:\n' + gl.getShaderInfoLog(shader));
        }
    }
    Shaders.compile_shader = compile_shader;
    function link_program(gl, vs, fs) {
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        } else {
            throw new Error('Program link error:\n' + gl.getProgramInfoLog(program));
        }
    }
    Shaders.link_program = link_program;
    function get_statements(src) {
        return _.map(Utils.trim_string(src).split(/;|\n/), function (statement) {
            return statement.split(/\s+/);
        });
    }
    var CompiledProgram = (function () {
        function CompiledProgram(gl, vs_src, fs_src) {
            this.gl = gl;
            this.uniforms = {
            };
            this.attribs = {
            };
            var vs = compile_shader(gl, vs_src, gl.VERTEX_SHADER);
            var fs = compile_shader(gl, fs_src, gl.FRAGMENT_SHADER);
            this.program = link_program(gl, vs, fs);
            this.set_locations(vs_src + '\n' + fs_src);
        }
        CompiledProgram.prototype.set_locations = function (src) {
            var statements = get_statements(src);
            var uniforms = statements.filter(function (stmt) {
                return stmt[0] === 'uniform';
            });
            var attrs = statements.filter(function (stmt) {
                return stmt[0] === 'attribute';
            });
            var i;
            var name;

            for(i = 0; i < uniforms.length; ++i) {
                name = uniforms[i][2];
                this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
            }
            for(i = 0; i < attrs.length; ++i) {
                name = attrs[i][2];
                this.attribs[name] = this.gl.getAttribLocation(this.program, name);
            }
        };
        return CompiledProgram;
    })();
    Shaders.CompiledProgram = CompiledProgram;    
})(Shaders || (Shaders = {}));

var ProgramManager = (function () {
    function ProgramManager(canvas_container) {
        this.canvas_container = canvas_container;
        this.requestAnimationFrame = Utils.get_prefixed_method(window, 'requestAnimationFrame');
        this.cancelAnimationFrame = Utils.get_prefixed_method(window, 'cancelAnimationFrame');
    }
    ProgramManager.prototype.animate = function () {
        var _this = this;
        this.current_program.paint(this.gl);
        this.animation = this.requestAnimationFrame(function () {
            return _this.animate();
        });
    };
    ProgramManager.prototype.start = function (program) {
        var _this = this;
        if(this.current_program || this.animation || this.canvas || this.gl) {
            throw new Error("There's a program running: " + this.current_program.name);
        }
        if(typeof program.start !== 'function') {
            throw new Error("Program doesn't have a start method");
        }
        Utils.load_many_txts([
            program.shaders.vs, 
            program.shaders.fs
        ], function (vs_src, fs_src) {
            _this.current_program = program;
            _this.canvas = document.createElement('canvas');
            _this.canvas.setAttribute('width', window.innerWidth.toString());
            _this.canvas.setAttribute('height', window.innerHeight.toString());
            _this.canvas.setAttribute('id', 'canvas');
            _this.canvas_container.appendChild(_this.canvas);
            _this.gl = _this.canvas.getContext('experimental-webgl');
            var compiled = new Shaders.CompiledProgram(_this.gl, vs_src, fs_src);
            _this.current_program.start(_this.gl, compiled);
            if(typeof _this.current_program.paint === 'function') {
                _this.animation = _this.requestAnimationFrame(function () {
                    return _this.animate();
                });
            }
        });
    };
    ProgramManager.prototype.stop = function () {
        if(typeof this.animation !== 'undefined') {
            this.cancelAnimationFrame(this.animation);
            this.animation = undefined;
        }
        if(this.current_program && typeof this.current_program.stop === 'function') {
            this.current_program.stop();
        }
        if(this.canvas) {
            this.canvas_container.removeChild(this.canvas);
        }
        this.canvas = undefined;
        this.gl = undefined;
        this.current_program = undefined;
    };
    ProgramManager.prototype.handle_key = function (event) {
        var handler = this.current_program && this.current_program.keys && this.current_program.keys[event.keyCode.toString()];
        if(typeof handler === 'function') {
            event.preventDefault();
            handler(this.gl, event);
        }
    };
    return ProgramManager;
})();
var Chapters;
(function (Chapters) {
    (function (_02) {
        function create_triangle_buffer(gl) {
            var verts = new Float32Array([
                -0.5, 
                0, 
                0, 
                1, 
                0.5, 
                0, 
                0, 
                1, 
                0, 
                0.5, 
                0, 
                1, 
                
            ]);
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            return buffer;
        }
        ; ;
        _02._01_Triangle = {
            name: 'Triangle',
            shaders: {
                vs: 'shaders/identity_vs.c',
                fs: 'shaders/identity_fs.c'
            },
            start: function (gl, program) {
                var buffer = create_triangle_buffer(gl);
                var vVertex = program.attribs['vVertex'];
                var vColor = program.uniforms['vColor'];
                gl.useProgram(program.program);
                gl.enableVertexAttribArray(vVertex);
                gl.uniform4f(vColor, 1, 0.3, 0.3, 1);
                gl.clearColor(0.3, 0.3, 1, 1);
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.vertexAttribPointer(vVertex, 4, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
            }
        };
    })(Chapters._02 || (Chapters._02 = {}));
    var _02 = Chapters._02;

})(Chapters || (Chapters = {}));

var Chapters;
(function (Chapters) {
    (function (_02) {
        var block_size = 0.1;
        var step_size = 0.025;

        var program;
        var buffer;
        var vVertex;
        var vColor;
        var verts = new Float32Array([
            -block_size, 
            -block_size, 
            block_size, 
            -block_size, 
            block_size, 
            block_size, 
            -block_size, 
            block_size, 
            
        ]);
        function paint(gl) {
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            gl.vertexAttribPointer(vVertex, 2, gl.FLOAT, false, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }
        function move(gl, event) {
            var x = verts[0];
            var y = verts[1];
            switch(event.keyCode) {
                case 37: {
                    x -= step_size;
                    break;

                }
                case 39: {
                    x += step_size;
                    break;

                }
                case 38: {
                    y += step_size;
                    break;

                }
                case 40: {
                    y -= step_size;
                    break;

                }
            }
            x = Math.max(x, -1);
            x = Math.min(x, 1 - block_size * 2);
            y = Math.max(y, -1);
            y = Math.min(y, 1 - block_size * 2);
            verts[0] = x;
            verts[1] = y;
            verts[2] = x + block_size * 2;
            verts[3] = y;
            verts[4] = verts[2];
            verts[5] = y + block_size * 2;
            verts[6] = x;
            verts[7] = verts[5];
            paint(gl);
        }
        _02._02_Move = {
            name: 'Move',
            shaders: {
                vs: 'shaders/identity_vs.c',
                fs: 'shaders/identity_fs.c'
            },
            start: function (gl, compiled) {
                program = compiled;
                vVertex = program.attribs['vVertex'];
                vColor = program.uniforms['vColor'];
                buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.useProgram(program.program);
                gl.enableVertexAttribArray(vVertex);
                gl.uniform4f(vColor, 1, 0.3, 0.3, 1);
                gl.clearColor(0.3, 0.3, 1, 1);
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                paint(gl);
            },
            stop: function () {
                program = null;
                buffer = null;
            },
            keys: {
                37: move,
                38: move,
                39: move,
                40: move
            }
        };
    })(Chapters._02 || (Chapters._02 = {}));
    var _02 = Chapters._02;

})(Chapters || (Chapters = {}));

var Chapters;
(function (Chapters) {
    (function (_02) {
        var block_size = 0.1;
        var step_size = 0.01;

        var xd = step_size;
        var yd = step_size;

        var max_xy = 1 - block_size * 2;
        var program;
        var buffer;
        var vVertex;
        var vColor;
        var verts = new Float32Array([
            -block_size, 
            -block_size, 
            block_size, 
            -block_size, 
            block_size, 
            block_size, 
            -block_size, 
            block_size, 
            
        ]);
        function change_dir(gl, event) {
            switch(event.keyCode) {
                case 37: {
                    xd = -step_size;
                    break;

                }
                case 39: {
                    xd = step_size;
                    break;

                }
                case 38: {
                    yd = step_size;
                    break;

                }
                case 40: {
                    yd = -step_size;
                    break;

                }
            }
        }
        ; ;
        function bounce() {
            var x = verts[0] + xd;
            var y = verts[1] + yd;
            if(x < -1) {
                x = -1;
                xd *= -1;
            } else {
                if(x > max_xy) {
                    x = max_xy;
                    xd *= -1;
                }
            }
            if(y < -1) {
                y = -1;
                yd *= -1;
            } else {
                if(y > max_xy) {
                    y = max_xy;
                    yd *= -1;
                }
            }
            verts[0] = x;
            verts[1] = y;
            verts[2] = x + block_size * 2;
            verts[3] = y;
            verts[4] = verts[2];
            verts[5] = y + block_size * 2;
            verts[6] = x;
            verts[7] = verts[5];
        }
        ; ;
        var valid = false;
        _02._03_Bounce = {
            name: 'Bounce',
            shaders: {
                vs: 'shaders/identity_vs.c',
                fs: 'shaders/identity_fs.c'
            },
            paint: function (gl) {
                if(!valid) {
                    return;
                }
                bounce();
                gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
                gl.vertexAttribPointer(vVertex, 2, gl.FLOAT, false, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            },
            start: function (gl, compiled) {
                program = compiled;
                valid = true;
                buffer = gl.createBuffer();
                vVertex = program.attribs['vVertex'];
                vColor = program.uniforms['vColor'];
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.useProgram(program.program);
                gl.enableVertexAttribArray(vVertex);
                gl.uniform4f(vColor, 1, 0.3, 0.3, 1);
                gl.clearColor(0.3, 0.3, 1, 1);
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            },
            stop: function () {
                valid = false;
                program = null;
                buffer = null;
            },
            keys: {
                37: change_dir,
                38: change_dir,
                39: change_dir,
                40: change_dir
            }
        };
    })(Chapters._02 || (Chapters._02 = {}));
    var _02 = Chapters._02;

})(Chapters || (Chapters = {}));

var Matrices;
(function (Matrices) {
    function zero(mat) {
        if(mat) {
            for(var i = 0; i < 16; ++i) {
                mat[i] = 0;
            }
            return mat;
        } else {
            return new Float32Array(16);
        }
    }
    Matrices.zero = zero;
    function identity(mat) {
        mat = zero(mat);
        mat[0] = 1;
        mat[5] = 1;
        mat[10] = 1;
        mat[15] = 1;
        return mat;
    }
    Matrices.identity = identity;
    function frustum(width, height, near, far, mat) {
        mat = zero(mat);
        mat[0] = 2 * near / width;
        mat[5] = 2 * near / height;
        mat[10] = (far + near) / (far - near);
        mat[11] = 1;
        mat[14] = (-2 * far * near) / (far - near);
        return mat;
    }
    Matrices.frustum = frustum;
    function multiply(a, b, mat) {
        mat = mat || new Float32Array(16);
        var i;
        var j;
        var k = 0;

        for(i = 0; i < 16; ++i) {
            j = i % 4;
            mat[i] = a[j] * b[k] + a[j + 4] * b[k + 1] + a[j + 8] * b[k + 2] + a[j + 12] * b[k + 3];
            if(j === 3) {
                k += 4;
            }
        }
        return mat;
    }
    Matrices.multiply = multiply;
    function scale(x, y, z, mat) {
        mat = mat || identity(mat);
        mat[0] *= x;
        mat[5] *= y;
        mat[10] *= z;
        return mat;
    }
    Matrices.scale = scale;
    function translate(x, y, z, mat) {
        mat = mat || identity();
        mat[12] += x;
        mat[13] += y;
        mat[14] += z;
        return mat;
    }
    Matrices.translate = translate;
})(Matrices || (Matrices = {}));

var Chapters;
(function (Chapters) {
    (function (_03) {
        function create_florida_buffer(gl) {
            var verts = new Float32Array([
                2.8, 
                1.2, 
                0, 
                2, 
                1.2, 
                0, 
                2, 
                1.08, 
                0, 
                2, 
                1.08, 
                0, 
                0, 
                0.8, 
                0, 
                -0.32, 
                0.4, 
                0, 
                -0.48, 
                0.2, 
                0, 
                -0.4, 
                0, 
                0, 
                -0.6, 
                -0.4, 
                0, 
                -0.8, 
                -0.8, 
                0, 
                -0.8, 
                -1.4, 
                0, 
                -0.4, 
                -1.6, 
                0, 
                0, 
                -1.2, 
                0, 
                0.2, 
                -0.8, 
                0, 
                0.48, 
                -0.4, 
                0, 
                0.52, 
                -0.2, 
                0, 
                0.48, 
                0.2, 
                0, 
                0.8, 
                0.4, 
                0, 
                1.2, 
                0.8, 
                0, 
                1.6, 
                0.6, 
                0, 
                2, 
                0.6, 
                0, 
                2.2, 
                0.8, 
                0, 
                2.4, 
                1, 
                0, 
                2.8, 
                1, 
                0
            ]);
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            return buffer;
        }
        ; ;
        _03._01_Primitives = {
            name: 'Primitives',
            shaders: {
                vs: 'shaders/flat_vs.c',
                fs: 'shaders/identity_fs.c'
            },
            start: function (gl, program) {
                var florida = create_florida_buffer(gl);
                var p = Matrices.frustum(5 * gl.drawingBufferWidth / gl.drawingBufferHeight, 5, 3, 500);
                var mv = Matrices.scale(-1, 1, 1, Matrices.translate(0, 0, 4));
                var mvp = Matrices.multiply(p, mv);
                var vVertex = program.attribs['vVertex'];
                var vColor = program.uniforms['vColor'];
                var mvpMatrix = program.uniforms['mvpMatrix'];
                gl.useProgram(program.program);
                gl.enableVertexAttribArray(vVertex);
                gl.uniform4f(vColor, 0, 0, 0, 1);
                gl.clearColor(1, 1, 1, 1);
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.vertexAttribPointer(vVertex, 3, gl.FLOAT, false, 0, 0);
                gl.uniformMatrix4fv(mvpMatrix, false, mvp);
                gl.drawArrays(gl.LINE_LOOP, 0, 24);
            }
        };
    })(Chapters._03 || (Chapters._03 = {}));
    var _03 = Chapters._03;

})(Chapters || (Chapters = {}));

var Menu;
(function (Menu) {
    function program_starter(manager, program) {
        return function (event) {
            manager.stop();
            manager.start(program);
        }
    }
    function get_program_by_id(id) {
        if(id.indexOf('.') !== -1) {
            var ids = id.split('.');
            var chapter = Chapters[ids[0]];
            if(chapter) {
                return chapter[ids[1]];
            }
        }
    }
    Menu.get_program_by_id = get_program_by_id;
    function gen_menu(chapters_ul, manager) {
        var names = _.keys(Chapters).sort();
        for(var i = 0; i < names.length; ++i) {
            var chapter = parseInt(names[i].match(/\d+/)[0], 10);
            var chapter_li = document.createElement('li');
            chapter_li.setAttribute('id', 'menu-chapter-' + chapter);
            chapter_li.innerHTML = 'Chapter ' + chapter;
            var chapter_ul = document.createElement('ul');
            chapter_li.appendChild(chapter_ul);
            var programs = _.keys(Chapters[names[i]]).sort();
            for(var j = 0; j < programs.length; ++j) {
                var program = Chapters[names[i]][programs[j]];
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerHTML = program.name;
                a.setAttribute('href', '#' + names[i] + '.' + programs[j]);
                a.onclick = program_starter(manager, program);
                li.appendChild(a);
                chapter_ul.appendChild(li);
            }
            chapters_ul.appendChild(chapter_li);
        }
    }
    Menu.gen_menu = gen_menu;
})(Menu || (Menu = {}));

var SuperBigle;
(function (SuperBigle) {
    var manager = new ProgramManager(document.getElementById('put-canvas-here'));
    window.onkeydown = function (event) {
        return manager.handle_key(event);
    };
    Menu.gen_menu(document.getElementById('menu'), manager);
    var startup_program = Menu.get_program_by_id(location.hash.substring(1));
    if(startup_program) {
        manager.start(startup_program);
    }
})(SuperBigle || (SuperBigle = {}));

//@ sourceMappingURL=all.js.map
