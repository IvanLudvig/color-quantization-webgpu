import params from '../params.js';

export async function setupCreateBox(device) {
    const SIDE_LENGTH = 33;
    const TOTAL_SIZE = 35937;

    const momentsBuffer = device.createBuffer({
        size: 5 * TOTAL_SIZE * Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    const momentsBindGroupLayout = device.createBindGroupLayout({
        entries: [{
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'read-only-storage' }
        }]
    });
    const momentsBindGroup = device.createBindGroup({
        layout: momentsBindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: momentsBuffer } }
        ]
    });

    const cubesBuffer = device.createBuffer({
        size: 6 * params.K * Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    });
    device.queue.writeBuffer(cubesBuffer, 0, new Uint32Array([0, SIDE_LENGTH - 1, 0, SIDE_LENGTH - 1, 0, SIDE_LENGTH - 1]));

    const variancesBuffer = device.createBuffer({
        size: params.K * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    const currentCubeIdxBuffer = device.createBuffer({
        size: Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    const totalCubesNumUniformBuffer = device.createBuffer({
        size: Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const cubesBindGroupLayout = device.createBindGroupLayout({
        entries: [{
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        }, {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        }, {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        }, {
            binding: 3,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'uniform' }
        }]
    });
    const cubesBindGroup = device.createBindGroup({
        layout: cubesBindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: cubesBuffer } },
            { binding: 1, resource: { buffer: variancesBuffer } },
            { binding: 2, resource: { buffer: currentCubeIdxBuffer } },
            { binding: 3, resource: { buffer: totalCubesNumUniformBuffer } }
        ]
    });

    const cutVariancesRBuffer = device.createBuffer({
        size: SIDE_LENGTH * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    });
    const cutVariancesGBuffer = device.createBuffer({
        size: SIDE_LENGTH * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    const cutVariancesBBuffer = device.createBuffer({
        size: SIDE_LENGTH * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    const bestCutBuffer = device.createBuffer({
        size: 3 * Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    const cutBindGroupLayout = device.createBindGroupLayout({
        entries: [{
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        }, {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        }, {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        }, {
            binding: 3,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'storage' }
        }]
    });
    const cutBindGroup = device.createBindGroup({
        layout: cutBindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: cutVariancesRBuffer } },
            { binding: 1, resource: { buffer: cutVariancesGBuffer } },
            { binding: 2, resource: { buffer: cutVariancesBBuffer } },
            { binding: 3, resource: { buffer: bestCutBuffer } }
        ]
    });

    const createBoxModule = device.createShaderModule({
        code: await fetch('src/shaders/create_box.wgsl').then(res => res.text())
    });
    const createBoxPipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [momentsBindGroupLayout, cubesBindGroupLayout, cutBindGroupLayout]
    });
    const createBoxPipeline = device.createComputePipeline({
        layout: createBoxPipelineLayout,
        compute: { module: createBoxModule }
    });

    return {
        momentsBuffer,
        momentsBindGroup,
        cubesBuffer,
        totalCubesNumUniformBuffer,
        momentsBindGroupLayout,
        cubesBindGroupLayout,
        cubesBindGroup,
        cutBindGroup,
        createBoxPipeline,
        cutVariancesRBuffer
    };
}