struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color : vec3f,
    @location(1) texcoord : vec2f,
    @location(2) normal : vec3f   // Pass normal to fragment shader
}

@group(0) @binding(0) var<uniform> matrix : mat4x4f;

@vertex
fn vs(
    @location(0) position : vec3f,
    @location(1) color : vec3f,
    @location(2) texcoord : vec2f,
    @location(3) instancePosition : vec3f,
    @location(4) normal : vec3f   // Normal passed as vertex attribute
) -> VertexOutput {
    var output: VertexOutput;
    output.position = matrix * vec4f(position + instancePosition, 1.0);
    output.color = color;
    output.texcoord = texcoord;
    output.normal = normal;  // Pass the normal through
    return output;
}


@group(1) @binding(0) var sample : sampler;
@group(1) @binding(1) var texel : texture_2d<f32>;

@group(2) @binding(0) var<uniform> lightDirection : vec3f;  // Light direction
@group(2) @binding(1) var<uniform> lightColor : vec3f;      // Light color
@group(2) @binding(2) var<uniform> ambientLight : vec3f;    // Ambient light

@fragment
fn fs(
    @location(0) fragColor : vec3f,
    @location(1) texcoord : vec2f,
    @location(2) normal : vec3f    // Receive normal from vertex shader
) -> @location(0) vec4f {
    let texColor = textureSample(texel, sample, texcoord);

    // Normalize the normal and light direction
    let norm = normalize(normal);
    let lightDir = normalize(-lightDirection);

    // Calculate the diffuse lighting (Lambertian reflection)
    let diff = max(dot(norm, lightDir), 0.0);
    let diffuse = diff * lightColor;

    // Combine with ambient lighting
    let lighting = ambientLight + diffuse;

    // Apply lighting to the texture color
    return texColor * vec4f(fragColor * lighting, 1.0);
}

