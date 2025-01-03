import { loadImageBitmap } from './utils.js';
import { setupCompute } from './pipelines/compute.js';
import { setupRender } from './pipelines/render.js';
import params from './params.js';

async function main() {
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
        window.alert('WebGPU not supported');
        throw new Error('WebGPU not supported');
    }

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('webgpu');
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format: canvasFormat });

    const source = await loadImageBitmap(params.imgPath);

    const {
        centroidsBuffer: computeCentroidsBuffer,
        clustersBuffer: computeClustersBuffer,
        assignPipeline,
        updatePipeline,
        computeBindGroup
    } = await setupCompute(device, source);

    const {
        renderPipeline,
        centroidPipeline,
        renderBindGroup,
        centroidsBuffer: renderCentroidsBuffer,
        clustersBuffer: renderClustersBuffer
    } = await setupRender(device, canvasFormat, source);

    const renderPassDescriptor = {
        colorAttachments: [{
            clearValue: [0.3, 0.3, 0.3, 1],
            loadOp: 'clear',
            storeOp: 'store',
            view: context.getCurrentTexture().createView()
        }]
    };

    function render() {
        const encoder = device.createCommandEncoder();

        for (let i = 0; i < params.iterations; i++) {
            const assignPass = encoder.beginComputePass();
            assignPass.setPipeline(assignPipeline);
            assignPass.setBindGroup(0, computeBindGroup);
            assignPass.dispatchWorkgroups(
                Math.ceil(params.imgSize[0] / params.workgroupSize[0]),
                Math.ceil(params.imgSize[1] / params.workgroupSize[1]),
                1
            );
            assignPass.end();

            const updatePass = encoder.beginComputePass();
            updatePass.setPipeline(updatePipeline);
            updatePass.setBindGroup(0, computeBindGroup);
            updatePass.dispatchWorkgroups(params.K);
            updatePass.end();
        }

        encoder.copyBufferToBuffer(
            computeClustersBuffer, 0,
            renderClustersBuffer, 0,
            4 * params.imgSize[0] * params.imgSize[1]
        );
        encoder.copyBufferToBuffer(
            computeCentroidsBuffer, 0,
            renderCentroidsBuffer, 0,
            3 * params.K * Float32Array.BYTES_PER_ELEMENT
        );

        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(renderPipeline);
        pass.setBindGroup(0, renderBindGroup);
        pass.draw(6);
        pass.setPipeline(centroidPipeline);
        pass.setBindGroup(0, renderBindGroup);
        pass.draw(6, params.K);
        pass.end();

        const commandBuffer = encoder.finish();
        device.queue.submit([commandBuffer]);
    }

    render();
}

main(); 