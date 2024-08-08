struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color : vec3f,
    @location(1) texcoord : vec2f
}

@group(0) @binding(0) var<uniform> matrix : mat4x4f;

@vertex
fn vs(
    @location(0) position : vec3f,
    @location(1) color : vec3f,
    @location(2) texcoord : vec2f,
    @location(3) instancePosition : vec3f
) -> VertexOutput {
    var output: VertexOutput;
    output.position = matrix * vec4f(position + instancePosition, 1.0);
    output.color = color;
    output.texcoord = texcoord;
    return output;
}

@group(1) @binding(0) var sample : sampler;
@group(1) @binding(1) var texel : texture_2d<f32>;

@fragment
fn fs(
    @location(0) fragColor : vec3f,
    @location(1) texcoord : vec2f
) -> @location(0) vec4f {
    let texColor = textureSample(texel, sample, texcoord);
    return texColor * vec4f(fragColor, 1.0);
}
