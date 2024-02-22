import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import useFetch from "@/components/hooks/useFetch";
import { 
    Button,
    BlockStack
} from "@shopify/polaris";
import { CampaignProduct } from "@/lib/types";
import MultiselectTagCombobox from "@/components/VerticalCombobox";

const CampaignProductTagForm: FC<{ 
    product: CampaignProduct;
    triggerToast: (msg: string) => void
}> = ({ 
    product,
    triggerToast = () => {}
}) => {
    const fetch = useFetch();
    const { handleSubmit, setValue, watch } = useForm<{
        tags: string[];
    }>({ defaultValues: { tags: [...product.tags] } });
    const tags = watch("tags");

    const [originalTags, setOriginalTags] = useState<string[]>([...product.tags]);
    const [tagsChanged, setTagsChanged] = useState<boolean>(false);

    const { mutate: updateProductTags, isLoading: isUpdatingProductTags } = useMutation<
      {
        product?: CampaignProduct;
        error?: { code: string; message: string };
      },
      any,
      { prod_id: string }
    >(
      (variables) =>
        fetch(`/api/apps/product/${variables.prod_id}/updatetags`, {
            method: "POST",
            body: JSON.stringify({
                data: tags
            }),
        }).then((response) => response.json()),
      {
        onSuccess: (data) => {
          const updatedProdTags = data.product.tags || [];
          setOriginalTags(updatedProdTags);
          setTagsChanged(false);
          triggerToast("Product Tags Updated");
        },
      }
    );

    useEffect(() => {
        setTagsChanged(tagsAreNotEqual());
    }, [tags]);

    useEffect(() => {
        console.log("is updating product tags", isUpdatingProductTags);
    }, [isUpdatingProductTags])

    function tagsAreNotEqual() {
        if(tags.length !== originalTags.length) return true;

        let equal = false;
        tags.forEach((tag, index) => {
            if(tag !== originalTags[index]) equal = true;
        })

        return equal;
    }

    function changeSelection(selection: string) {
        const nextSelectedTags = new Set([...tags]);
  
        if (nextSelectedTags.has(selection)) {
          nextSelectedTags.delete(selection);
        } else {
          nextSelectedTags.add(selection);
        }
        setValue("tags", ([...Array.from(nextSelectedTags)]));
    }


    const onSubmit = handleSubmit(async (fields: { tags: string[] }) => {
        const prod_id = product.id.split("/").reverse()[0];
        updateProductTags({ prod_id });
    });

    return (
        <BlockStack gap="400" inlineAlign="end">
            <div style={{ width: "100%" }}>
                <MultiselectTagCombobox 
                    selectedTags={tags}
                    onChange={changeSelection}
                />
            </div>
            
            <Button 
                variant="primary" 
                onClick={onSubmit}
                disabled={!tagsChanged}
                loading={isUpdatingProductTags}
            >
                Save Tags
            </Button>
        </BlockStack>
        
    )
}

export default CampaignProductTagForm;