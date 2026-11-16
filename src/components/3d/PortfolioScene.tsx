import { Canvas, useFrame, useLoader, useThree, type ThreeElements } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Euler,
  CatmullRomCurve3,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  Mesh,
  TextureLoader,
  PointLight,
  DirectionalLight,
  Quaternion,
  Vector2,
  Vector3,
  SRGBColorSpace,
} from "three";
import { SceneFallback } from "./SceneFallback";
import smokehousePreview from "../../assets/projects/smokehouse-preview.png";
import { technologies } from "../../lib/technologies";
import { timeline } from "../../lib/timeline";
import { experiments } from "../lab/experiments";
import { courses } from "../Courses";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

type SceneVariant = "intro" | "hero" | "world";
export type WorldSection =
  | "hero"
  | "sobre"
  | "tecnologias"
  | "projetos"
  | "lab"
  | "cursos"
  | "contato";

type PortfolioSceneProps = {
  variant?: SceneVariant;
  className?: string;
  interactive?: boolean;
  section?: WorldSection;
  focus?: string;
  particles?: boolean;
  interactionProgress?: number;
  releasing?: boolean;
  onReady?: () => void;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function SceneContent({
  variant,
  interactive,
  section = "hero",
  focus = "",
  particles = true,
  interactionProgress = 0,
  releasing = false,
}: {
  variant: SceneVariant;
  interactive: boolean;
  section?: WorldSection;
  focus?: string;
  particles?: boolean;
  interactionProgress?: number;
  releasing?: boolean;
}) {
  const group = useRef<Group>(null);
  const fragments = useRef<InstancedMesh>(null);
  const pointer = useRef(new Vector2());
  const { camera, invalidate } = useThree();
  const fragmentData = useMemo(
    () =>
      Array.from({ length: variant === "intro" ? 34 : variant === "world" ? 20 : 24 }, (_, index) => ({
        start: new Vector3(
          ((index * 71) % 23) / 3.8 - 3,
          ((index * 43) % 29) / 4.2 - 3.4,
          ((index * 31) % 19) / 2.4 - 4.2,
        ),
        target: new Vector3(
          ((index * 47) % 17) / 5 - 1.7,
          ((index * 29) % 19) / 5 - 1.9,
          ((index * 13) % 11) / 4 - 1.2,
        ),
        startRotation: new Euler(index * 0.61, index * 0.37, index * 0.29),
        targetRotation: new Euler(
          index * 0.21,
          index * 0.13,
          index * 0.17,
        ),
        scale: 0.035 + (index % 5) * 0.014,
        delay: (index % 9) * 0.16,
      })),
    [variant],
  );
  const light = useRef<PointLight>(null);
  const rimLight = useRef<DirectionalLight>(null);
  const ring = useRef<Mesh>(null);
  const tempPosition = useMemo(() => new Vector3(), []);
  const center = useMemo(() => new Vector3(), []);
  const tempScale = useMemo(() => new Vector3(), []);
  const tempRotation = useMemo(() => new Euler(), []);
  const tempQuaternion = useMemo(() => new Quaternion(), []);
  const matrix = useMemo(() => new Matrix4(), []);
  const releaseStartedAt = useRef<number | null>(null);
  const releaseProgress = useRef(0);
  const sectionProgress = useRef(0);
  const labModalOpen = useRef(false);

  useEffect(() => {
    releaseStartedAt.current = releasing ? performance.now() : null;
  }, [releasing]);

  useEffect(() => {
    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ section: WorldSection; progress: number }>).detail;
      if (detail.section === section) sectionProgress.current = detail.progress;
    };
    window.addEventListener("portfolio:section-progress", handleProgress);
    return () => window.removeEventListener("portfolio:section-progress", handleProgress);
  }, [section]);

  useEffect(() => {
    const handleModal = (event: Event) => {
      labModalOpen.current = Boolean((event as CustomEvent<boolean>).detail);
    };
    window.addEventListener("portfolio:lab-modal", handleModal);
    return () => window.removeEventListener("portfolio:lab-modal", handleModal);
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (variant !== "intro") invalidate();
    };
    if (interactive) window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [interactive]);

  useEffect(() => {
    const updateCamera = () => {
      camera.position.z = window.innerWidth < 640 ? 6.8 : 5.5;
      camera.updateProjectionMatrix();
    };
    updateCamera();
    window.addEventListener("resize", updateCamera);
    return () => window.removeEventListener("resize", updateCamera);
  }, [camera]);

  useEffect(() => {
    const mesh = fragments.current;
    if (!mesh) return;
    fragmentData.forEach((fragment, index) => {
      matrix.compose(
        fragment.target,
        tempQuaternion.setFromEuler(fragment.targetRotation),
        tempScale.setScalar(fragment.scale),
      );
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [fragmentData]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!group.current) return;
    const worldDepth = section === "projetos" ? 1.24 : section === "contato" ? 1.12 : 1;
    const focusPulse = focus ? 1 : 0;
    const charge = variant === "intro" ? interactionProgress : 0;
    const release = releasing && releaseStartedAt.current !== null
      ? MathUtils.smoothstep((performance.now() - releaseStartedAt.current) / 1150, 0, 1)
      : 0;
    releaseProgress.current = release;
    const ambientReveal = variant === "intro" ? MathUtils.smoothstep(time, 0.35, 2.2) : 1;
    const assembly = variant === "intro" ? MathUtils.smoothstep(time, 2.1, 7.8) : 1;
    const reveal = variant === "intro" ? MathUtils.smoothstep(time, 6.2, 9.7) : 1;
    const scale = variant === "intro"
      ? 0.74 + assembly * 0.26 + reveal * 0.08
      : (variant === "world" ? 0.88 * worldDepth : 1.12);
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      (interactive ? pointer.current.x * (variant === "world" ? 0.44 : 0.62) : 0) + Math.sin(time * 0.22) * (0.2 + focusPulse * 0.16),
      0.045,
    );
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      (interactive ? -pointer.current.y * (variant === "world" ? 0.3 : 0.42) : 0) + Math.cos(time * 0.18) * 0.14,
      0.045,
    );
    group.current.position.y = Math.sin(time * 0.42) * (variant === "intro" ? 0.14 : 0.18);
    group.current.position.x = variant === "world"
      ? (section === "hero" ? 0.7 : section === "tecnologias" ? -1.35 : section === "contato" ? 1.2 : 0)
      : 0;
    group.current.scale.setScalar(scale + focusPulse * 0.08 + charge * 0.12 + release * 0.08);
    camera.position.x = MathUtils.lerp(camera.position.x, (interactive ? pointer.current.x * 0.85 : 0) + Math.sin(time * 0.16) * 0.2 + release * pointer.current.x * 0.45, 0.045);
    camera.position.y = MathUtils.lerp(camera.position.y, (interactive ? pointer.current.y * 0.48 : 0) + Math.cos(time * 0.13) * 0.14 + release * pointer.current.y * 0.3, 0.045);
    camera.position.z = MathUtils.lerp(
      camera.position.z,
      variant === "intro"
        ? 7.4 - reveal * 2.15 - charge * 0.8 - release * 3.35
        :                 variant === "world"
          ? section === "tecnologias" && focus
            ? 5.7
            : section === "sobre"
              ? 6.4 - sectionProgress.current * 0.85
              : section === "lab" && focus && !labModalOpen.current
                ? 5.9
              : 6.4
          : 4.9,
      0.035,
    );
    camera.lookAt(variant === "intro" ? 0 : variant === "world" && section === "tecnologias" ? -0.5 : 0.35, 0, 0);
    if (light.current) {
      light.current.intensity = 0.35 + ambientReveal * 1.7 + Math.sin(time * 0.8) * 0.22 + charge * 1.4 + release * 1.8;
      light.current.position.x = -3 + pointer.current.x * 2.5;
      light.current.position.y = 1.5 + pointer.current.y * 1.4;
    }
    if (rimLight.current) rimLight.current.intensity = 0.45 + reveal * 1.5 + (variant === "world" ? 0.35 : 0) + focusPulse * 0.45 + charge * 0.8 + release * 1.2;
    if (ring.current) {
      ring.current.rotation.x = time * 0.18 + pointer.current.y * 0.3;
      ring.current.rotation.y = time * 0.24 + pointer.current.x * 0.4;
      ring.current.scale.setScalar(0.82 + reveal * 0.18 + charge * 0.35 + release * 0.7);
    }
    if (fragments.current) {
      fragmentData.forEach((fragment, index) => {
        const progress = variant === "intro" ? MathUtils.smoothstep(time - fragment.delay, 1.5, 6.3) : 1;
        tempPosition.lerpVectors(fragment.start, fragment.target, progress);
        if (variant === "intro" && charge > 0) {
          tempPosition.lerp(center, charge * 0.14);
        }
        if (variant === "intro" && release > 0) {
          tempPosition.multiplyScalar(1 + release * 2.8);
        }
        tempPosition.y += Math.sin(time * 0.7 + index) * 0.045;
        tempRotation.set(
          MathUtils.lerp(fragment.startRotation.x, fragment.targetRotation.x, progress) + time * 0.16,
          MathUtils.lerp(fragment.startRotation.y, fragment.targetRotation.y, progress) + time * 0.12,
          MathUtils.lerp(fragment.startRotation.z, fragment.targetRotation.z, progress),
        );
        matrix.compose(tempPosition, tempQuaternion.setFromEuler(tempRotation), tempScale.setScalar(fragment.scale));
        fragments.current!.setMatrixAt(index, matrix);
      });
      fragments.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={variant === "intro" ? 0.32 : 0.5} color="#eeeae2" />
      <directionalLight ref={rimLight} position={[3, 4, 5]} intensity={1.5} color="#c7b597" />
      <pointLight ref={light} position={[-3, -1, 2]} intensity={1.4} distance={8} color="#9eae9d" />
      <group
        ref={group}
        position={variant === "intro" ? [0, 0, 0] : variant === "world" ? [0, 0, -0.4] : [1.05, 0, -0.2]}
      >
        {variant === "world" && section === "tecnologias" ? (
          <TechConstellation focus={focus} />
        ) : variant === "world" && section === "sobre" ? (
          <group>
            <TrajectoryScene focus={focus} progressRef={sectionProgress} />
            <OrbitPortraitScene progressRef={sectionProgress} reducedMotion={!interactive} />
          </group>
        ) : variant === "world" && section === "lab" ? (
          <LabArcade focus={focus} progressRef={sectionProgress} modalOpen={labModalOpen} />
        ) : variant === "world" && section === "cursos" ? (
          <CourseArchive focus={focus} progressRef={sectionProgress} />
        ) : (
          <>
            <SignatureObject releaseProgress={releaseProgress} />
            <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.7, 0.025, 8, 64]} />
              <meshPhysicalMaterial
                color="#d8c6a5"
                metalness={0.82}
                roughness={0.16}
                transmission={variant === "intro" ? 0.35 : 0}
                transparent
                opacity={0.62}
                clearcoat={0.8}
              />
            </mesh>
            <instancedMesh ref={fragments} args={[undefined, undefined, fragmentData.length]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color="#c7b597"
                metalness={0.88}
                roughness={0.24}
                transparent
                opacity={0.68}
              />
            </instancedMesh>
            {particles && <SparkField count={variant === "intro" ? 42 : variant === "world" ? 28 : 24} />}
            {variant === "world" && section === "projetos" && <ProjectGallery focus={focus} />}
          </>
        )}
      </group>
    </>
  );
}

const galleryProjects = [
  { id: "finora", image: `${import.meta.env.BASE_URL}images/projects/finora.webp`, position: [-2.5, 0.4, -0.5] as [number, number, number], accent: "#bcae91" },
  { id: "speakup", image: `${import.meta.env.BASE_URL}images/projects/speakup.webp`, position: [-0.8, -0.35, -1.35] as [number, number, number], accent: "#9eae9d" },
  { id: "mesaflow", image: `${import.meta.env.BASE_URL}images/projects/mesaflow.webp`, position: [1.05, 0.42, -2.05] as [number, number, number], accent: "#c7b597" },
  { id: "smokehouse", image: smokehousePreview, position: [2.55, -0.32, -2.75] as [number, number, number], accent: "#cb8b79" },
];

function ProjectGallery({ focus }: { focus: string }) {
  const textures = useLoader(TextureLoader, galleryProjects.map((project) => project.image));
  textures.forEach((texture) => {
    texture.colorSpace = SRGBColorSpace;
  });
  const gallery = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);
  const enteredAt = useRef<number | null>(null);
  const focusIndex = galleryProjects.findIndex((project) => project.id === focus);

  useFrame(({ clock }) => {
    if (!gallery.current) return;
    const now = performance.now();
    if (enteredAt.current === null) enteredAt.current = now;
    const entry = MathUtils.smoothstep((now - enteredAt.current) / 900, 0, 1);
    gallery.current.scale.setScalar(entry);
    gallery.current.rotation.y = MathUtils.lerp(
      gallery.current.rotation.y,
      pointer.x * 0.09 + Math.sin(clock.getElapsedTime() * 0.18) * 0.035,
      0.035,
    );
    gallery.current.rotation.x = MathUtils.lerp(
      gallery.current.rotation.x,
      -pointer.y * 0.055,
      0.035,
    );
  });

  return (
    <group ref={gallery} position={[0, 0, -0.45]}>
      {galleryProjects.map((project, index) => (
        <ProjectStructure
          key={project.id}
          project={project}
          index={index}
          focused={index === focusIndex}
          texture={textures[index]}
        />
      ))}
    </group>
  );
}

function ProjectStructure({
  project,
  index,
  focused,
  texture,
}: {
  project: (typeof galleryProjects)[number];
  index: number;
  focused: boolean;
  texture?: import("three").Texture;
}) {
  const structure = useRef<Group>(null);
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetScale = useMemo(() => new Vector3(), []);
  const targetRotation = useMemo(() => new Euler(), []);

  useFrame(({ clock }) => {
    if (!structure.current) return;
    const time = clock.getElapsedTime();
    const drift = Math.sin(time * 0.32 + index * 1.7) * 0.06;
    targetPosition.set(
      project.position[0],
      project.position[1] + drift,
      project.position[2] + (focused ? 1.45 : 0),
    );
    targetScale.setScalar(focused ? 1.24 : 0.82 + index * 0.025);
    targetRotation.set(
      focused ? -0.025 : Math.sin(time * 0.16 + index) * 0.035,
      focused ? 0 : Math.cos(time * 0.14 + index) * 0.12,
      focused ? 0 : Math.sin(time * 0.2 + index) * 0.025,
    );
    structure.current.position.lerp(targetPosition, 0.055);
    structure.current.scale.lerp(targetScale, 0.055);
    structure.current.rotation.x = MathUtils.lerp(structure.current.rotation.x, targetRotation.x, 0.055);
    structure.current.rotation.y = MathUtils.lerp(structure.current.rotation.y, targetRotation.y, 0.055);
    structure.current.rotation.z = MathUtils.lerp(structure.current.rotation.z, targetRotation.z, 0.055);
  });

  return (
    <group ref={structure} position={project.position}>
      <pointLight
        position={[0, 0.2, 0.6]}
        color={project.accent}
        intensity={focused ? 1.7 : 0.3}
        distance={3.5}
      />
      <mesh>
        <boxGeometry args={[1.75, 1.12, 0.12]} />
        <meshStandardMaterial
          color="#242525"
          metalness={0.88}
          roughness={0.25}
          emissive={project.accent}
          emissiveIntensity={focused ? 0.12 : 0.025}
        />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.52, 0.88]} />
        {texture ? (
          <meshStandardMaterial map={texture} metalness={0.15} roughness={0.48} />
        ) : (
          <meshStandardMaterial
            color={project.accent}
            metalness={0.62}
            roughness={0.32}
            emissive={project.accent}
            emissiveIntensity={focused ? 0.16 : 0.045}
          />
        )}
      </mesh>
      <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[2.05, 0.18, 0.08]} />
        <meshStandardMaterial color={project.accent} metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[-0.86, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.12, 1.28, 0.08]} />
        <meshStandardMaterial color={project.accent} metalness={0.92} roughness={0.2} />
      </mesh>
      {!texture && (
        <>
          <mesh position={[0, 0.22, 0.13]}>
            <boxGeometry args={[0.85, 0.035, 0.02]} />
            <meshBasicMaterial color="#eeeae2" transparent opacity={focused ? 0.78 : 0.35} />
          </mesh>
          <mesh position={[0, -0.02, 0.13]}>
            <boxGeometry args={[1.15, 0.018, 0.02]} />
            <meshBasicMaterial color="#eeeae2" transparent opacity={focused ? 0.54 : 0.22} />
          </mesh>
        </>
      )}
    </group>
  );
}

const constellationColors = ["#c7b597", "#9eae9d", "#b9a79a", "#a9b0a5", "#d0c0a1"];

type ConstellationNode = {
  id: string;
  name: string;
  category: string;
  projects: string[];
  position: [number, number, number];
  color: string;
  project?: boolean;
};

function TechConstellation({ focus }: { focus: string }) {
  const constellation = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);
  const targetPosition = useMemo(() => new Vector3(), []);
  const categorySlots = useMemo(() => {
    const slots = new Map<string, number>();
    return technologies.map((technology, index) => {
      const slot = slots.get(technology.category) ?? 0;
      slots.set(technology.category, slot + 1);
      const categoryIndex = Array.from(new Set(technologies.map((item) => item.category))).indexOf(technology.category);
      const angle = (categoryIndex / 13) * Math.PI * 2 - Math.PI / 2;
      const radius = 1.65 + (categoryIndex % 3) * 0.18;
      return {
        id: `technology:${technology.name}`,
        name: technology.name,
        category: technology.category,
        projects: technology.projects.map((project) => project.name),
        position: [
          Math.cos(angle) * radius + (slot % 2) * 0.3,
          Math.sin(angle) * radius * 0.7 + Math.floor(slot / 2) * 0.32 - 0.2,
          -0.65 - (categoryIndex % 4) * 0.42 - slot * 0.08,
        ] as [number, number, number],
        color: constellationColors[categoryIndex % constellationColors.length],
      };
    });
  }, []);
  const projectNames = useMemo(
    () => Array.from(new Set(technologies.flatMap((technology) => technology.projects.map((project) => project.name)))),
    [],
  );
  const nodes = useMemo<ConstellationNode[]>(
    () => [
      ...categorySlots,
      ...projectNames.map((name, index) => ({
        id: `project:${name}`,
        name,
        category: "Projeto",
        projects: [name],
        position: [
          Math.cos((index / projectNames.length) * Math.PI * 2) * 2.7,
          Math.sin((index / projectNames.length) * Math.PI * 2) * 1.55,
          -2.4,
        ] as [number, number, number],
        color: "#7f8e84",
        project: true,
      })),
    ],
    [categorySlots, projectNames],
  );
  const technologyNodes = nodes.filter((node) => !node.project);
  const edges = useMemo(() => {
    const result: Array<[ConstellationNode, ConstellationNode]> = [];
    technologyNodes.forEach((source, sourceIndex) => {
      technologyNodes.slice(sourceIndex + 1).forEach((target) => {
        const sharedProject = source.projects.some((project) => target.projects.includes(project));
        if (source.category === target.category || sharedProject) result.push([source, target]);
      });
      source.projects.forEach((project) => {
        const anchor = nodes.find((node) => node.project && node.name === project);
        if (anchor) result.push([source, anchor]);
      });
    });
    return result;
  }, [nodes, technologyNodes]);
  const focusedNode = technologyNodes.find((node) => node.name === focus);
  const related = useMemo(() => {
    if (!focusedNode) return new Set<string>();
    return new Set(
      technologyNodes
        .filter(
          (node) =>
            node.category === focusedNode.category ||
            node.projects.some((project) => focusedNode.projects.includes(project)),
        )
        .map((node) => node.id),
    );
  }, [focusedNode, technologyNodes]);

  useFrame(({ clock }) => {
    if (!constellation.current) return;
    const time = clock.getElapsedTime();
    targetPosition.set(
      focusedNode ? -focusedNode.position[0] * 0.18 : 0,
      focusedNode ? -focusedNode.position[1] * 0.18 : 0,
      focusedNode ? 0.26 : 0,
    );
    constellation.current.position.lerp(targetPosition, 0.04);
    constellation.current.rotation.y = MathUtils.lerp(
      constellation.current.rotation.y,
      pointer.x * 0.1 + Math.sin(time * 0.16) * 0.035,
      0.035,
    );
    constellation.current.rotation.x = MathUtils.lerp(
      constellation.current.rotation.x,
      -pointer.y * 0.07,
      0.035,
    );
  });

  return (
    <group ref={constellation}>
      {edges.map(([source, target], index) => {
        const active = !focus || source.id === `technology:${focus}` || target.id === `technology:${focus}` || related.has(source.id) || related.has(target.id);
        return (
          <Line
            key={`${source.id}-${target.id}`}
            points={[source.position, target.position]}
            color={active ? source.color : "#667068"}
            transparent
            opacity={active ? (focus ? 0.48 : 0.25) : 0.08}
            lineWidth={active ? 0.7 : 0.35}
            dashed
            dashSize={0.08}
            gapSize={0.12}
            dashOffset={-index * 0.01}
          />
        );
      })}
      {nodes.map((node) => (
        <TechNode
          key={node.id}
          node={node}
          focused={node.name === focus}
          related={related.has(node.id)}
          hasFocus={Boolean(focus)}
        />
      ))}
    </group>
  );
}

function TechNode({
  node,
  focused,
  related,
  hasFocus,
}: {
  node: ConstellationNode;
  focused: boolean;
  related: boolean;
  hasFocus: boolean;
}) {
  const nodeRef = useRef<Group>(null);
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetScale = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    if (!nodeRef.current) return;
    const time = clock.getElapsedTime();
    targetPosition.set(
      node.position[0],
      node.position[1] + Math.sin(time * 0.28 + node.position[0]) * (node.project ? 0.045 : 0.075),
      node.position[2] + (focused ? 1.1 : 0),
    );
    targetScale.setScalar(focused ? 1.45 : node.project ? 0.7 : related ? 1.05 : 0.8);
    nodeRef.current.position.lerp(targetPosition, 0.06);
    nodeRef.current.scale.lerp(targetScale, 0.06);
  });

  return (
    <group ref={nodeRef} position={node.position}>
      <pointLight
        color={node.color}
        intensity={focused ? 1.6 : related ? 0.45 : 0.12}
        distance={focused ? 2.4 : 1.3}
      />
      <mesh>
        {node.project ? <boxGeometry args={[0.24, 0.24, 0.24]} /> : <icosahedronGeometry args={[0.16, 1]} />}
        <meshStandardMaterial
          color={node.color}
          metalness={0.76}
          roughness={0.26}
          emissive={node.color}
          emissiveIntensity={focused ? 0.35 : related ? 0.12 : 0.025}
          transparent
          opacity={focused ? 0.95 : related ? 0.68 : hasFocus && !node.project ? 0.26 : 0.82}
        />
      </mesh>
      <Html center distanceFactor={7} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}>
        <span
          className={`text-[9px] uppercase tracking-[0.12em] ${
            focused ? "text-[var(--text-primary)]" : node.project ? "text-[var(--text-muted)]" : "text-[var(--text-secondary)]"
          }`}
        >
          {node.name}
        </span>
      </Html>
    </group>
  );
}

const trajectoryPositions = [
  new Vector3(-2.2, 0.55, -0.75),
  new Vector3(0, -0.4, -1.65),
  new Vector3(2.15, 0.62, -2.35),
];

function TrajectoryScene({
  focus,
  progressRef,
}: {
  focus: string;
  progressRef: { current: number };
}) {
  const scene = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);
  const path = useMemo(
    () => new CatmullRomCurve3(trajectoryPositions, false, "centripetal", 0.5).getPoints(18),
    [],
  );
  const focusIndex = focus.startsWith("about:")
    ? Number(focus.replace("about:", ""))
    : -1;

  useFrame(({ clock }) => {
    if (!scene.current) return;
    const time = clock.getElapsedTime();
    scene.current.rotation.y = MathUtils.lerp(
      scene.current.rotation.y,
      pointer.x * 0.1 + Math.sin(time * 0.16) * 0.025,
      0.035,
    );
    scene.current.rotation.x = MathUtils.lerp(scene.current.rotation.x, -pointer.y * 0.06, 0.035);
  });

  return (
    <group ref={scene} position={[0, 0, -0.45]}>
      {path.slice(0, -1).map((point, index) => (
        <TrajectorySegment
          key={`trajectory-segment-${index}`}
          from={point}
          to={path[index + 1]}
          index={index}
          count={path.length - 1}
          progressRef={progressRef}
        />
      ))}
      <pointLight position={[0, 0, 0]} color="#c7b597" intensity={0.75} distance={5} />
      {trajectoryPositions.map((position, index) => (
        <TrajectoryNode
          key={`${timeline[index].year}-${timeline[index].title}`}
          position={position}
          index={index}
          focusIndex={focusIndex}
          progressRef={progressRef}
          label={timeline[index].title}
          year={timeline[index].year}
        />
      ))}
    </group>
  );
}

const orbitArcDefinitions = [
  { radius: 1.25, tilt: 0.18, rotation: 0.35, color: "#c7b597" },
  { radius: 1.48, tilt: -0.3, rotation: -0.55, color: "#9eae9d" },
  { radius: 1.72, tilt: 0.48, rotation: 1.05, color: "#bcae91" },
];

function OrbitPortraitScene({
  progressRef,
  reducedMotion,
}: {
  progressRef: { current: number };
  reducedMotion: boolean;
}) {
  const orbit = useRef<Group>(null);
  const beacon = useRef<Mesh>(null);
  const beaconLight = useRef<PointLight>(null);
  const pointer = useThree((state) => state.pointer);
  const arcs = useMemo(
    () =>
      orbitArcDefinitions.map((definition) =>
        Array.from({ length: 25 }, (_, index) => {
          const angle = -Math.PI * 0.82 + (index / 24) * Math.PI * 1.64;
          const point = new Vector3(
            Math.cos(angle) * definition.radius,
            Math.sin(angle) * definition.radius,
            0,
          );
          point.applyAxisAngle(new Vector3(1, 0, 0), definition.tilt);
          point.applyAxisAngle(new Vector3(0, 0, 1), definition.rotation);
          return point;
        }),
      ),
    [],
  );
  const fragments = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        position: new Vector3(
          Math.cos(index * 2.4) * (1.45 + (index % 3) * 0.18),
          Math.sin(index * 1.7) * (1.1 + (index % 2) * 0.2),
          -0.25 + (index % 4) * 0.16,
        ),
        scale: 0.035 + (index % 3) * 0.018,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!orbit.current) return;
    const time = reducedMotion ? 0 : clock.getElapsedTime();
    const progress = MathUtils.smoothstep(progressRef.current, 0, 1);
    orbit.current.position.x = MathUtils.lerp(
      orbit.current.position.x,
      window.innerWidth < 640 ? 0 : 1.55,
      0.045,
    );
    orbit.current.position.y = MathUtils.lerp(
      orbit.current.position.y,
      pointer.y * 0.1,
      0.035,
    );
    orbit.current.rotation.y = MathUtils.lerp(
      orbit.current.rotation.y,
      pointer.x * 0.16 + Math.sin(time * 0.14) * 0.04,
      0.035,
    );
    orbit.current.rotation.x = MathUtils.lerp(
      orbit.current.rotation.x,
      -pointer.y * 0.08,
      0.035,
    );
    if (beacon.current) {
      const arcProgress = (progress * 0.92 + (time * 0.035) % 0.08) % 1;
      const arc = arcs[1];
      const pointIndex = Math.min(arc.length - 1, Math.floor(arcProgress * arc.length));
      beacon.current.position.lerp(arc[pointIndex], 0.12);
      beacon.current.scale.setScalar(0.7 + progress * 0.45);
    }
    if (beaconLight.current) {
      beaconLight.current.intensity = 0.5 + progress * 1.3 + Math.sin(time * 2.2) * 0.12;
    }
  });

  return (
    <group ref={orbit} position={[1.55, 0, -0.55]} scale={0.92}>
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[1.28, 1.86, 0.045]} />
        <meshStandardMaterial
          color="#242525"
          metalness={0.9}
          roughness={0.24}
          transparent
          opacity={0.58}
        />
      </mesh>
      {[
        [0, 0.98, 0.16, 1.5, 0.035, 0.035],
        [0, -0.98, 0.16, 1.5, 0.035, 0.035],
        [-0.73, 0, 0.16, 0.035, 2, 0.035],
        [0.73, 0, 0.16, 0.035, 2, 0.035],
      ].map(([x, y, z, width, height, depth], index) => (
        <mesh key={`portrait-frame-${index}`} position={[x, y, z]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color="#c7b597"
            metalness={0.92}
            roughness={0.2}
            emissive="#c7b597"
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
      {arcs.map((points, index) => (
        <Line
          key={`portrait-orbit-${index}`}
          points={points}
          color={orbitArcDefinitions[index].color}
          lineWidth={index === 1 ? 1.15 : 0.7}
          transparent
          opacity={0.42 - index * 0.06}
        />
      ))}
      <mesh ref={beacon} position={arcs[1][0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color="#eeeae2"
          emissive="#c7b597"
          emissiveIntensity={1.8}
          metalness={0.35}
          roughness={0.2}
        />
      </mesh>
      <pointLight ref={beaconLight} position={[0, 0, 0.25]} color="#c7b597" distance={3.5} />
      {fragments.map((fragment, index) => (
        <mesh key={`portrait-fragment-${index}`} position={fragment.position} scale={fragment.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={index % 2 ? "#9eae9d" : "#c7b597"}
            metalness={0.82}
            roughness={0.28}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function TrajectorySegment({
  from,
  to,
  index,
  count,
  progressRef,
}: {
  from: Vector3;
  to: Vector3;
  index: number;
  count: number;
  progressRef: { current: number };
}) {
  const material = useRef<MeshStandardMaterial>(null);
  const midpoint = useMemo(() => from.clone().lerp(to, 0.5), [from, to]);
  const direction = useMemo(() => to.clone().sub(from), [from, to]);
  const length = direction.length();
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize()),
    [direction],
  );

  useFrame(() => {
    if (!material.current) return;
    const reveal = MathUtils.smoothstep(
      progressRef.current,
      Math.max(0, index / count - 0.12),
      Math.min(1, (index + 1) / count + 0.08),
    );
    material.current.opacity = 0.08 + reveal * 0.62;
    material.current.emissiveIntensity = 0.025 + reveal * 0.2;
  });

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.018, 0.018, length, 6]} />
      <meshStandardMaterial
        ref={material}
        color="#b9a789"
        emissive="#c7b597"
        metalness={0.72}
        roughness={0.3}
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

function TrajectoryNode({
  position,
  index,
  focusIndex,
  progressRef,
  label,
  year,
}: {
  position: Vector3;
  index: number;
  focusIndex: number;
  progressRef: { current: number };
  label: string;
  year: string;
}) {
  const node = useRef<Group>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetScale = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    if (!node.current || !material.current) return;
    const scrollReveal = MathUtils.smoothstep(
      progressRef.current,
      Math.max(0, index / (trajectoryPositions.length - 1) - 0.18),
      Math.min(1, (index + 1) / trajectoryPositions.length),
    );
    const focused = focusIndex === index;
    const active = focused || (focusIndex < 0 && index === Math.min(trajectoryPositions.length - 1, Math.floor(progressRef.current * trajectoryPositions.length)));
    targetPosition.copy(position);
    targetPosition.z += active ? 0.34 : 0;
    targetScale.setScalar(active ? 1.28 : 0.72 + scrollReveal * 0.28);
    node.current.position.lerp(targetPosition, 0.06);
    node.current.scale.lerp(targetScale, 0.06);
    material.current.opacity = 0.16 + scrollReveal * 0.58;
    material.current.emissiveIntensity = active ? 0.34 + Math.sin(clock.getElapsedTime() * 2.2) * 0.04 : 0.08;
  });

  return (
    <group ref={node} position={position}>
      <pointLight color="#c7b597" intensity={focusIndex === index ? 1.35 : 0.3} distance={2.2} />
      <mesh>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial
          ref={material}
          color="#c7b597"
          emissive="#b9a789"
          metalness={0.86}
          roughness={0.22}
          transparent
          opacity={0.16}
        />
      </mesh>
      <Html center distanceFactor={7} style={{ pointerEvents: "none", whiteSpace: "nowrap" }}>
        <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          {year} · {label}
        </span>
      </Html>
    </group>
  );
}

const arcadePositions: [number, number, number][] = [
  [-2.4, 0.65, -0.5],
  [-1.6, -0.65, -1.05],
  [-0.45, 0.85, -1.5],
  [0.65, -0.7, -1.9],
  [1.65, 0.75, -2.35],
  [2.25, -0.45, -2.75],
  [0, 0, -3.2],
];

function LabArcade({
  focus,
  progressRef,
  modalOpen,
}: {
  focus: string;
  progressRef: { current: number };
  modalOpen: { current: boolean };
}) {
  const arcade = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);
  const focusId = focus.startsWith("lab:") ? focus.slice(4) : "";

  useFrame(({ clock }) => {
    if (!arcade.current) return;
    const time = clock.getElapsedTime();
    const targetScale = modalOpen.current ? 0.72 : 1;
    arcade.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.06);
    arcade.current.rotation.y = MathUtils.lerp(
      arcade.current.rotation.y,
      pointer.x * 0.08 + Math.sin(time * 0.18) * 0.025,
      0.035,
    );
    arcade.current.rotation.x = MathUtils.lerp(arcade.current.rotation.x, -pointer.y * 0.055, 0.035);
  });

  return (
    <group ref={arcade} position={[0, 0, -0.35]}>
      <mesh position={[0, -1.25, -1.6]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[6.8, 0.12, 3.2]} />
        <meshStandardMaterial color="#252726" metalness={0.88} roughness={0.28} />
      </mesh>
      <pointLight position={[0, 0.5, 1]} color="#c7b597" intensity={modalOpen.current ? 0.18 : 1.1} distance={6} />
      {experiments.map((experiment, index) => (
        <ArcadeModule
          key={experiment.id}
          id={experiment.id}
          position={arcadePositions[index]}
          index={index}
          focused={focusId === experiment.id}
          progressRef={progressRef}
          accent={experiment.accent}
        />
      ))}
    </group>
  );
}

function ArcadeModule({
  id,
  position,
  index,
  focused,
  progressRef,
  accent,
}: {
  id: string;
  position: [number, number, number];
  index: number;
  focused: boolean;
  progressRef: { current: number };
  accent: string;
}) {
  const moduleRef = useRef<Group>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetScale = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    if (!moduleRef.current || !material.current) return;
    const time = clock.getElapsedTime();
    const entry = MathUtils.smoothstep(progressRef.current + 0.18, index / experiments.length, (index + 2) / experiments.length);
    targetPosition.set(position[0], position[1] + Math.sin(time * 0.35 + index) * 0.06, position[2]);
    targetScale.setScalar(focused ? 1.28 : 0.72 + entry * 0.28);
    moduleRef.current.position.lerp(targetPosition, 0.055);
    moduleRef.current.scale.lerp(targetScale, 0.055);
    material.current.opacity = 0.18 + entry * (focused ? 0.7 : 0.42);
    material.current.emissiveIntensity = focused ? 0.3 + Math.sin(time * 2) * 0.04 : 0.06;
  });

  return (
    <group ref={moduleRef} position={position}>
      <pointLight color={accent} intensity={focused ? 1.5 : 0.22} distance={1.8} />
      <mesh>
        <boxGeometry args={[0.8, 0.12, 0.58]} />
        <meshStandardMaterial
          ref={material}
          color="#2a2b2a"
          emissive={accent}
          metalness={0.82}
          roughness={0.25}
          transparent
          opacity={0.2}
        />
      </mesh>
      {id === "snake" && Array.from({ length: 4 }, (_, cell) => (
        <mesh key={cell} position={[-0.22 + cell * 0.15, 0.16 + Math.sin(cell) * 0.04, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color={accent} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {id === "tetris" && Array.from({ length: 5 }, (_, cell) => (
        <mesh key={cell} position={[-0.22 + (cell % 3) * 0.16, 0.13 + Math.floor(cell / 3) * 0.16, 0]}>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshStandardMaterial color={accent} metalness={0.78} roughness={0.25} />
        </mesh>
      ))}
      {id === "pong" && (
        <>
          <mesh position={[-0.3, 0.18, 0]}><boxGeometry args={[0.06, 0.3, 0.06]} /><meshStandardMaterial color={accent} /></mesh>
          <mesh position={[0.3, 0.18, 0]}><boxGeometry args={[0.06, 0.3, 0.06]} /><meshStandardMaterial color={accent} /></mesh>
          <mesh position={[0.03, 0.2, 0]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#eeeae2" emissive="#eeeae2" emissiveIntensity={0.2} /></mesh>
        </>
      )}
      {id === "breakout" && Array.from({ length: 6 }, (_, cell) => (
        <mesh key={cell} position={[-0.25 + (cell % 3) * 0.2, 0.16 + Math.floor(cell / 3) * 0.14, 0]}>
          <boxGeometry args={[0.16, 0.09, 0.12]} />
          <meshStandardMaterial color={accent} metalness={0.72} roughness={0.3} />
        </mesh>
      ))}
      {id === "memory" && Array.from({ length: 4 }, (_, cell) => (
        <mesh key={cell} position={[-0.2 + (cell % 2) * 0.22, 0.16, -0.1 + Math.floor(cell / 2) * 0.2]} rotation={[0, cell % 2 ? 0.15 : -0.15, 0]}>
          <boxGeometry args={[0.14, 0.03, 0.16]} />
          <meshStandardMaterial color={accent} metalness={0.6} roughness={0.28} />
        </mesh>
      ))}
      {id === "typing" && Array.from({ length: 3 }, (_, cell) => (
        <mesh key={cell} position={[-0.2 + cell * 0.2, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.035 + cell * 0.04, 0.03]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      ))}
      {id === "drawing" && Array.from({ length: 4 }, (_, cell) => (
        <mesh key={cell} position={[-0.25 + cell * 0.16, 0.18 + Math.sin(cell) * 0.12, 0]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      ))}
    </group>
  );
}

function CourseArchive({
  focus,
  progressRef,
}: {
  focus: string;
  progressRef: { current: number };
}) {
  const archive = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);
  const focusIndex = focus.startsWith("course:") ? Number(focus.slice(7)) : -1;

  useFrame(({ clock }) => {
    if (!archive.current) return;
    const time = clock.getElapsedTime();
    archive.current.rotation.y = MathUtils.lerp(
      archive.current.rotation.y,
      pointer.x * 0.08 + Math.sin(time * 0.14) * 0.02,
      0.035,
    );
    archive.current.rotation.x = MathUtils.lerp(archive.current.rotation.x, -pointer.y * 0.045, 0.035);
  });

  return (
    <group ref={archive} position={[0, 0, -0.6]}>
      {Array.from({ length: 6 }, (_, index) => (
        <ArchivePanel
          key={index}
          index={index}
          progressRef={progressRef}
          focused={focusIndex >= 0 && Math.floor(focusIndex / Math.max(1, Math.ceil(courses.length / 6))) === index}
        />
      ))}
    </group>
  );
}

function ArchivePanel({
  index,
  progressRef,
  focused,
}: {
  index: number;
  progressRef: { current: number };
  focused: boolean;
}) {
  const panel = useRef<Group>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const target = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    if (!panel.current || !material.current) return;
    const reveal = MathUtils.smoothstep(progressRef.current + 0.12, index / 6, (index + 1.7) / 6);
    target.set((index % 2 ? 1 : -1) * 1.25, 0.9 - index * 0.34 + Math.sin(clock.getElapsedTime() * 0.2 + index) * 0.035, -index * 0.36);
    panel.current.position.lerp(target, 0.045);
    panel.current.scale.lerp(new Vector3(focused ? 1.16 : 0.9 + reveal * 0.1, focused ? 1.16 : 0.9 + reveal * 0.1, focused ? 1.16 : 0.9 + reveal * 0.1), 0.045);
    material.current.opacity = 0.1 + reveal * (focused ? 0.62 : 0.34);
    material.current.emissiveIntensity = focused ? 0.2 : 0.035;
  });

  return (
    <group ref={panel} position={[(index % 2 ? 1 : -1) * 1.25, 0.9 - index * 0.34, -index * 0.36]}>
      <mesh>
        <boxGeometry args={[1.65, 0.18, 0.9]} />
        <meshStandardMaterial ref={material} color="#303130" emissive="#b9a789" metalness={0.84} roughness={0.28} transparent opacity={0.1} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[1.25, 0.025, 0.035]} />
        <meshBasicMaterial color="#c7b597" transparent opacity={focused ? 0.7 : 0.28} />
      </mesh>
      <mesh position={[0, -0.13, 0]}>
        <boxGeometry args={[0.86, 0.018, 0.03]} />
        <meshBasicMaterial color="#9eae9d" transparent opacity={focused ? 0.5 : 0.18} />
      </mesh>
    </group>
  );
}

function SparkField({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const data = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      position: [
        ((index * 37) % 31) / 5 - 3.1,
        ((index * 19) % 27) / 5 - 2.7,
        ((index * 13) % 23) / 4 - 2.8,
      ] as [number, number, number],
      scale: 0.012 + (index % 3) * 0.008,
    })),
    [count],
  );
  const matrix = useMemo(() => new Matrix4(), []);
  const position = useMemo(() => new Vector3(), []);
  const scale = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();
    data.forEach((spark, index) => {
      position.set(
        spark.position[0],
        spark.position[1] + Math.sin(time * 0.35 + index) * 0.08,
        spark.position[2],
      );
      matrix.compose(position, new Quaternion(), scale.setScalar(spark.scale));
      mesh.current!.setMatrixAt(index, matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#e2d4ba" transparent opacity={0.72} />
    </instancedMesh>
  );
}

function SignatureObject({
  releaseProgress,
}: {
  releaseProgress: { current: number };
}) {
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#c7b597",
        metalness: 0.9,
        roughness: 0.2,
        emissive: "#3d3528",
        emissiveIntensity: 0.16,
      }),
    [],
  );

  const left = useRef<Mesh>(null);
  const right = useRef<Mesh>(null);
  const lower = useRef<Mesh>(null);
  const upper = useRef<Mesh>(null);
  const targets = useMemo(
    () => [
      new Vector3(-2.2, 1.4, 1.4),
      new Vector3(2.2, 1.1, -1.6),
      new Vector3(-0.2, -2, 0.9),
      new Vector3(0.7, 2.2, -0.8),
    ],
    [],
  );
  const meshes = [left, right, lower, upper];

  useFrame(({ clock }) => {
    const progress = releaseProgress.current;
    meshes.forEach((meshRef, index) => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const eased = MathUtils.smoothstep(progress, 0.12, 0.92);
      mesh.position.lerpVectors(
        new Vector3(index === 0 ? -0.72 : index === 1 ? 0.72 : index === 2 ? 0 : 0, index === 2 ? -0.05 : index === 3 ? 0.58 : 0, 0),
        targets[index],
        eased,
      );
      mesh.rotation.z += (0.008 + index * 0.002) * eased;
      mesh.rotation.x = Math.sin(clock.getElapsedTime() * 1.8 + index) * 0.25 * eased;
    });
  });

  return (
    <group rotation={[0.08, -0.22, 0.04]}>
      <mesh ref={left} position={[-0.72, 0, 0]} rotation={[0, 0, -0.5]} material={material}>
        <boxGeometry args={[0.18, 2.45, 0.28]} />
      </mesh>
      <mesh ref={right} position={[0.72, 0, 0]} rotation={[0, 0, 0.5]} material={material}>
        <boxGeometry args={[0.18, 2.45, 0.28]} />
      </mesh>
      <mesh ref={lower} position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={material}>
        <boxGeometry args={[0.18, 1.55, 0.28]} />
      </mesh>
      <mesh ref={upper} position={[0, 0.58, 0]} rotation={[0, 0, Math.PI / 2]} material={material}>
        <boxGeometry args={[0.12, 0.92, 0.2]} />
      </mesh>
    </group>
  );
}

export function PortfolioScene({
  variant = "hero",
  className,
  interactive = false,
  section = "hero",
  focus = "",
  particles = true,
  interactionProgress = 0,
  releasing = false,
  onReady,
}: PortfolioSceneProps) {
  const [available, setAvailable] = useState(true);
  const [active, setActive] = useState(true);
  const [renderQuality, setRenderQuality] = useState({ dpr: 1.25, antialias: true });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailable(supportsWebGL());
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const constrained = cores <= 4 || memory <= 4;
    setRenderQuality({
      dpr: constrained ? 1 : Math.min(1.25, window.devicePixelRatio || 1),
      antialias: !constrained,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateVisibility = () => setActive(!document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && !document.hidden),
      { threshold: 0.01 },
    );
    observer.observe(container);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  if (!available) return <SceneFallback />;

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 36 }}
        dpr={[1, renderQuality.dpr]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: renderQuality.antialias, alpha: true, powerPreference: "high-performance" }}
        onCreated={onReady}
        fallback={<SceneFallback />}
      >
        <Suspense fallback={null}>
          <SceneContent
            variant={variant}
            interactive={interactive}
            section={section}
            focus={focus}
            particles={particles}
            interactionProgress={interactionProgress}
            releasing={releasing}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
