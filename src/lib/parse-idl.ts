import { Instruction, InstructionAccount, PDA } from "./types";

export function parseIDL(idl: any) {
  if (!idl || typeof idl !== "object") {
    throw new Error("Invalid IDL format");
  }

  return {
    programAddress: idl.address,
    name: idl.metadata?.name || "Unknown Program",
    version: idl.metadata?.version || "N/A",
    description: idl.metadata?.description || "No description available",

    instructions: idl.instructions.map((inst: any) => ({
      name: inst.name,
      discriminator: inst.discriminator,
      accounts: inst.accounts.map((acc: any) => ({
        address: acc.address,
        name: acc.name,
        writable: acc.writable || false,
        signer: acc.signer || false,
        pda: acc.pda ? acc.pda.seeds.map((seed: any) => seed.kind) : null,
      })),
      args: inst.args.map((arg: any) => ({
        name: arg.name,
        type: arg.type,
      })),
    })),

    accounts: idl.accounts?.map((acc: any) => ({
      name: acc.name,
      discriminator: acc.discriminator,
    })) || [],

    pdas: Array.from(
      new Map(
        idl.instructions
          .flatMap((inst: Instruction) =>
            inst.accounts
              .filter((acc: any) => acc.pda)
              .map((acc: any) => ({
                name: acc.name,
                seeds: acc.pda.seeds.map((seed: any) => ({
                  kind: seed.kind,
                  value: seed.value,
                })),
              }))
          )
          .map((pda:InstructionAccount) => [pda.name, pda]) // Use Map to ensure uniqueness by name
      ).values()
    ),

    systemPrograms: idl.instructions.flatMap((inst: any) =>
      inst.accounts.filter((acc: any) => acc.address).map((acc: any) => acc.address)
    ),

    // ✅ Fixed `types` extraction
    types: idl.types?.map((t: any) => ({
      name: t.name, // ✅ Ensure each type has a `name`
      type: {
        fields: t.type.fields.map((field: any) => ({
          name: field.name,
          type: field.type,
        })),
      },
    })) || [],
  };
}
